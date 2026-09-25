/**
 * Native Agent Client
 * Connects to the local Host Companion Agent over loopback WebSocket (ws://127.0.0.1:48123).
 * Relays remote controller mouse, keyboard, and shortcut events to the OS input driver with
 * Origin verification and session pairing token authentication.
 */

import { logger } from "@/lib/logger";
import type { NativeAgentStatus, RemoteDesktopInputEvent } from "../types";

const LOCAL_AGENT_URL = "ws://127.0.0.1:48123";
const STORAGE_KEY = "versolyn_agent_token";

export class NativeAgentClient {
  private ws: WebSocket | null = null;
  private isConnecting = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private status: NativeAgentStatus = { connected: false };
  private sessionToken: string | null = null;
  private cachedToken: string = "";
  public onStatusChange?: (status: NativeAgentStatus) => void;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.cachedToken = window.localStorage.getItem(STORAGE_KEY) || "";
      } catch {
        this.cachedToken = "";
      }
    }
  }

  public connect(tokenOverride?: string): void {
    if (tokenOverride) {
      this.cachedToken = tokenOverride.trim();
    }

    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }
    if (this.isConnecting) return;

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(LOCAL_AGENT_URL);

      this.ws.onopen = () => {
        this.isConnecting = false;
        logger.info("Connected to Native Host Companion Agent on 127.0.0.1:48123");
        // Send initial handshake with pairing token if available
        this.send({
          type: "HANDSHAKE",
          client: "versolyn-host-web",
          token: this.cachedToken,
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "HANDSHAKE_ACK" || data.type === "AUTH_SUCCESS") {
            this.sessionToken = data.sessionToken || null;
            this.status = {
              connected: true,
              authenticated: true,
              requiresAuth: false,
              authError: undefined,
              version: data.version || "1.0.0",
              os: data.os || "windows",
              screenWidth: data.screenWidth || 1920,
              screenHeight: data.screenHeight || 1080,
              lastPing: Date.now(),
            };
            if (this.cachedToken && typeof window !== "undefined") {
              try {
                window.localStorage.setItem(STORAGE_KEY, this.cachedToken);
              } catch {
                /* ignore */
              }
            }
            this.notifyStatus();
          } else if (data.type === "AUTH_REQUIRED") {
            this.sessionToken = null;
            this.status = {
              connected: false,
              authenticated: false,
              requiresAuth: true,
              authError: data.message || "Pairing token or PIN required",
              version: data.version,
              os: data.os,
            };
            this.notifyStatus();
          } else if (data.type === "AUTH_FAILED") {
            this.sessionToken = null;
            this.status = {
              connected: false,
              authenticated: false,
              requiresAuth: true,
              authError: data.error || "Invalid pairing token/PIN",
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
        this.sessionToken = null;
        if (this.status.connected) {
          logger.info("Disconnected from Native Host Companion Agent");
        }
        this.status = {
          connected: false,
          authenticated: false,
          requiresAuth: false,
        };
        this.notifyStatus();
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.isConnecting = false;
        this.sessionToken = null;
        // Expected when user has not launched the native agent yet
        this.status = { connected: false, authenticated: false };
        this.notifyStatus();
      };
    } catch {
      this.isConnecting = false;
      this.sessionToken = null;
      this.status = { connected: false, authenticated: false };
      this.notifyStatus();
      this.scheduleReconnect();
    }
  }

  /**
   * Authenticate with the native companion agent using the pairing PIN/token
   */
  public authenticate(token: string): boolean {
    const cleanToken = token.trim();
    if (!cleanToken) return false;
    this.cachedToken = cleanToken;

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.connect(cleanToken);
      return true;
    }

    return this.send({
      type: "AUTHENTICATE",
      token: cleanToken,
    });
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

  private send(data: unknown): boolean {
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
   * Requires an authenticated active session with valid sessionToken
   */
  public executeInput(event: RemoteDesktopInputEvent): boolean {
    if (
      !this.status.connected ||
      !this.sessionToken ||
      !this.ws ||
      this.ws.readyState !== WebSocket.OPEN
    ) {
      return false;
    }

    return this.send({
      type: "INPUT_EVENT",
      sessionToken: this.sessionToken,
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
    this.sessionToken = null;
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
      this.ws = null;
    }
    this.status = { connected: false, authenticated: false, requiresAuth: false };
    this.notifyStatus();
  }
}

export const nativeAgentClient = new NativeAgentClient();
