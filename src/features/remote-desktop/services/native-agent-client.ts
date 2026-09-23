/**
 * Native Agent Client
 * Connects to the local Host Companion Agent over loopback WebSocket (ws://127.0.0.1:48123).
 * Relays remote controller mouse, keyboard, and shortcut events to the OS input driver.
 */

import { logger } from "@/lib/logger";
import type { NativeAgentStatus, RemoteDesktopInputEvent } from "../types";

const LOCAL_AGENT_URL = "ws://127.0.0.1:48123";

export class NativeAgentClient {
  private ws: WebSocket | null = null;
  private isConnecting = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private status: NativeAgentStatus = { connected: false };
  public onStatusChange?: (status: NativeAgentStatus) => void;

  constructor() {
    // Lazy connect on demand
  }

  public connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    if (this.isConnecting) return;

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(LOCAL_AGENT_URL);

      this.ws.onopen = () => {
        this.isConnecting = false;
        logger.info("Connected to Native Host Companion Agent on 127.0.0.1:48123");
        this.send({ type: "HANDSHAKE", client: "versolyn-host-web" });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "HANDSHAKE_ACK") {
            this.status = {
              connected: true,
              version: data.version || "1.0.0",
              os: data.os || "windows",
              screenWidth: data.screenWidth || 1920,
              screenHeight: data.screenHeight || 1080,
              lastPing: Date.now(),
            };
            this.notifyStatus();
          } else if (data.type === "PONG") {
            this.status.lastPing = Date.now();
          }
        } catch (e) {
          logger.warn("Failed to parse native agent message", e);
        }
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        if (this.status.connected) {
          logger.info("Disconnected from Native Host Companion Agent");
        }
        this.status = { connected: false };
        this.notifyStatus();
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.isConnecting = false;
        // Expected when user has not launched the native agent yet
        this.status = { connected: false };
        this.notifyStatus();
      };
    } catch (err) {
      this.isConnecting = false;
      this.status = { connected: false };
      this.notifyStatus();
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, 4000);
  }

  private notifyStatus(): void {
    if (this.onStatusChange) {
      this.onStatusChange({ ...this.status });
    }
  }

  private send(data: any): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(data));
        return true;
      } catch (err) {
        logger.warn("Failed to send command to native agent", err);
        return false;
      }
    }
    return false;
  }

  /**
   * Execute an incoming controller input event via native OS input injection
   */
  public executeInput(event: RemoteDesktopInputEvent): boolean {
    if (!this.status.connected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    return this.send({
      type: "INPUT_EVENT",
      event,
    });
  }

  public getStatus(): NativeAgentStatus {
    return { ...this.status };
  }

  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
      this.ws = null;
    }
    this.status = { connected: false };
    this.notifyStatus();
  }
}

export const nativeAgentClient = new NativeAgentClient();
