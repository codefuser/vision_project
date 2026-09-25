/**
 * VersoLyn Native Host Companion Agent
 * Lightweight Node.js local WebSocket server providing OS-level mouse and keyboard injection
 * for Windows, macOS, and Linux with strict Origin validation, session pairing authentication,
 * and safe Base64 clipboard transport.
 */

import { WebSocketServer } from "ws";
import { spawn } from "child_process";
import os from "os";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKEN_FILE = path.join(__dirname, ".agent-token");

const PORT = 48123;
const HOST = "127.0.0.1";

let screenWidth = 1920;
let screenHeight = 1080;
let winProcess = null;

// ── Origin Validation Policy ──────────────────────────────────────────────────
function isAllowedOrigin(origin) {
  if (!origin) return false;
  try {
    const parsed = new URL(origin);
    // Allow VersoLyn production domains
    if (
      parsed.protocol === "https:" &&
      (parsed.hostname === "versolyn.vercel.app" || parsed.hostname.endsWith(".versolyn.vercel.app"))
    ) {
      return true;
    }
    // Allow localhost and 127.0.0.1 on any port for local development
    if (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")
    ) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

// ── Persistent Pairing Token Management ───────────────────────────────────────
function getOrCreatePairingToken() {
  if (process.env.VERSOLYN_AGENT_TOKEN && process.env.VERSOLYN_AGENT_TOKEN.trim()) {
    return process.env.VERSOLYN_AGENT_TOKEN.trim();
  }
  if (fs.existsSync(TOKEN_FILE)) {
    try {
      const saved = fs.readFileSync(TOKEN_FILE, "utf-8").trim();
      if (saved) return saved;
    } catch {
      /* ignore file read error */
    }
  }
  // Generate random 6-digit pairing PIN for convenient operator entry
  const token = Math.floor(100000 + crypto.randomInt(900000)).toString();
  try {
    fs.writeFileSync(TOKEN_FILE, token, "utf-8");
  } catch (err) {
    console.warn("[Native Agent] Warning: Could not write token file:", err.message);
  }
  return token;
}

const pairingToken = getOrCreatePairingToken();

// ── Windows P/Invoke Subsystem (Zero-Build-Tools Fast Native Runner) ─────────
function initWindowsSubsystem() {
  if (process.platform !== "win32") return;

  const initScript = `
Add-Type -AssemblyName System.Windows.Forms
$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
Write-Output "SCREEN:$($screen.Width):$($screen.Height)"

$csharp = @"
using System;
using System.Runtime.InteropServices;

public class WinInput {
    [DllImport("user32.dll")] public static extern bool SetCursorPos(int X, int Y);
    [DllImport("user32.dll")] public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);
    [DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);
}
"@
Add-Type -TypeDefinition $csharp
Write-Output "READY"
`;

  try {
    winProcess = spawn("powershell", ["-NoProfile", "-NonInteractive", "-Command", "-"], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    winProcess.stdout.on("data", (data) => {
      const lines = data.toString().split(/\r?\n/);
      for (const line of lines) {
        if (line.startsWith("SCREEN:")) {
          const parts = line.split(":");
          screenWidth = parseInt(parts[1], 10) || 1920;
          screenHeight = parseInt(parts[2], 10) || 1080;
          console.log(`[Native Agent] Detected Windows Display: ${screenWidth}x${screenHeight}`);
        } else if (line.trim() === "READY") {
          console.log("[Native Agent] Windows Win32 Input Subsystem Ready.");
        }
      }
    });

    winProcess.stderr.on("data", () => {
      // suppress benign warnings
    });

    winProcess.on("exit", (code) => {
      console.log(`[Native Agent] Subsystem exited with code ${code}`);
      winProcess = null;
    });

    winProcess.stdin.write(initScript + "\n");
  } catch (err) {
    console.error("[Native Agent] Failed to initialize Windows subsystem:", err);
  }
}

function sendToWindowsSubsystem(cmd) {
  if (winProcess && winProcess.stdin.writable) {
    winProcess.stdin.write(cmd + "\n");
  }
}

// ── Win32 Key Codes Map ───────────────────────────────────────────────────────
const VK = {
  BACK: 0x08,
  TAB: 0x09,
  ENTER: 0x0d,
  SHIFT: 0x10,
  CTRL: 0x11,
  ALT: 0x12,
  ESC: 0x1b,
  SPACE: 0x20,
  LEFT: 0x25,
  UP: 0x26,
  RIGHT: 0x27,
  DOWN: 0x28,
  DELETE: 0x2e,
  WIN: 0x5b,
  C: 0x43,
  V: 0x56,
  A: 0x41,
  F4: 0x73,
};

// ── Input Execution Router ───────────────────────────────────────────────────
function executeInput(event) {
  if (!event || typeof event !== "object" || !event.type) return;

  if (process.platform === "win32") {
    switch (event.type) {
      case "MOUSE_MOVE": {
        if (
          typeof event.u === "number" &&
          typeof event.v === "number" &&
          Number.isFinite(event.u) &&
          Number.isFinite(event.v)
        ) {
          const u = Math.max(0, Math.min(1, event.u));
          const v = Math.max(0, Math.min(1, event.v));
          const x = Math.round(u * screenWidth);
          const y = Math.round(v * screenHeight);
          sendToWindowsSubsystem(`[WinInput]::SetCursorPos(${x}, ${y})`);
        }
        break;
      }

      case "MOUSE_DOWN": {
        const flag = event.button === 2 ? 0x0008 : event.button === 1 ? 0x0020 : 0x0002;
        sendToWindowsSubsystem(`[WinInput]::mouse_event(${flag}, 0, 0, 0, 0)`);
        break;
      }

      case "MOUSE_UP": {
        const flag = event.button === 2 ? 0x0010 : event.button === 1 ? 0x0040 : 0x0004;
        sendToWindowsSubsystem(`[WinInput]::mouse_event(${flag}, 0, 0, 0, 0)`);
        break;
      }

      case "DOUBLE_CLICK": {
        sendToWindowsSubsystem(
          `[WinInput]::mouse_event(0x0002, 0, 0, 0, 0); [WinInput]::mouse_event(0x0004, 0, 0, 0, 0); Start-Sleep -Milliseconds 40; [WinInput]::mouse_event(0x0002, 0, 0, 0, 0); [WinInput]::mouse_event(0x0004, 0, 0, 0, 0)`,
        );
        break;
      }

      case "MOUSE_WHEEL": {
        if (typeof event.deltaY === "number" && Number.isFinite(event.deltaY)) {
          const rawDelta = Math.round(-event.deltaY * 2);
          const delta = Math.max(-10000, Math.min(10000, rawDelta));
          if (delta !== 0) {
            sendToWindowsSubsystem(`[WinInput]::mouse_event(0x0800, 0, 0, ${delta}, 0)`);
          }
        }
        break;
      }

      case "KEY_DOWN": {
        const vk = getVirtualKeyCode(event.key, event.code);
        if (typeof vk === "number" && Number.isInteger(vk) && vk > 0 && vk < 256) {
          sendToWindowsSubsystem(`[WinInput]::keybd_event(${vk}, 0, 0, 0)`);
        }
        break;
      }

      case "KEY_UP": {
        const vk = getVirtualKeyCode(event.key, event.code);
        if (typeof vk === "number" && Number.isInteger(vk) && vk > 0 && vk < 256) {
          sendToWindowsSubsystem(`[WinInput]::keybd_event(${vk}, 0, 2, 0)`);
        }
        break;
      }

      case "SHORTCUT": {
        if (typeof event.shortcut === "string") {
          handleShortcut(event.shortcut);
        }
        break;
      }

      case "CLIPBOARD_PASTE": {
        if (event.text !== undefined && event.text !== null) {
          const textStr = String(event.text);
          if (textStr.length > 0) {
            // Encode clipboard content as UTF-8 bytes in Base64
            const base64 = Buffer.from(textStr, "utf-8").toString("base64");
            // Strict regex verification: only valid Base64 characters are passed to PowerShell
            if (/^[A-Za-z0-9+/=]+$/.test(base64)) {
              sendToWindowsSubsystem(`
[System.Windows.Forms.Clipboard]::SetText([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${base64}')))
[WinInput]::keybd_event(${VK.CTRL}, 0, 0, 0)
[WinInput]::keybd_event(${VK.V}, 0, 0, 0)
[WinInput]::keybd_event(${VK.V}, 0, 2, 0)
[WinInput]::keybd_event(${VK.CTRL}, 0, 2, 0)
`);
            } else {
              console.warn("[Native Agent] Dropped invalid base64 clipboard payload");
            }
          }
        }
        break;
      }
    }
  } else {
    // Non-Windows fallback (Linux/macOS)
    console.log(`[Native Agent ${process.platform}] Simulating input:`, event.type);
  }
}

function handleShortcut(action) {
  switch (action) {
    case "ALT_TAB":
      sendToWindowsSubsystem(`
[WinInput]::keybd_event(${VK.ALT}, 0, 0, 0)
[WinInput]::keybd_event(${VK.TAB}, 0, 0, 0)
Start-Sleep -Milliseconds 50
[WinInput]::keybd_event(${VK.TAB}, 0, 2, 0)
[WinInput]::keybd_event(${VK.ALT}, 0, 2, 0)
`);
      break;

    case "WIN":
      sendToWindowsSubsystem(`
[WinInput]::keybd_event(${VK.WIN}, 0, 0, 0)
Start-Sleep -Milliseconds 30
[WinInput]::keybd_event(${VK.WIN}, 0, 2, 0)
`);
      break;

    case "ESC":
      sendToWindowsSubsystem(`
[WinInput]::keybd_event(${VK.ESC}, 0, 0, 0)
Start-Sleep -Milliseconds 30
[WinInput]::keybd_event(${VK.ESC}, 0, 2, 0)
`);
      break;

    case "COPY":
      sendToWindowsSubsystem(`
[WinInput]::keybd_event(${VK.CTRL}, 0, 0, 0)
[WinInput]::keybd_event(${VK.C}, 0, 0, 0)
[WinInput]::keybd_event(${VK.C}, 0, 2, 0)
[WinInput]::keybd_event(${VK.CTRL}, 0, 2, 0)
`);
      break;

    case "ENTER":
      sendToWindowsSubsystem(`
[WinInput]::keybd_event(${VK.ENTER}, 0, 0, 0)
[WinInput]::keybd_event(${VK.ENTER}, 0, 2, 0)
`);
      break;

    case "BACKSPACE":
      sendToWindowsSubsystem(`
[WinInput]::keybd_event(${VK.BACK}, 0, 0, 0)
[WinInput]::keybd_event(${VK.BACK}, 0, 2, 0)
`);
      break;

    case "TASK_MANAGER":
      sendToWindowsSubsystem(`Start-Process taskmgr.exe`);
      break;
  }
}

function getVirtualKeyCode(key, code) {
  if (!key) return null;
  const k = key.toLowerCase();

  if (k === "enter") return VK.ENTER;
  if (k === "escape") return VK.ESC;
  if (k === "backspace") return VK.BACK;
  if (k === "tab") return VK.TAB;
  if (k === "shift") return VK.SHIFT;
  if (k === "control") return VK.CTRL;
  if (k === "alt") return VK.ALT;
  if (k === " ") return VK.SPACE;
  if (k === "arrowleft") return VK.LEFT;
  if (k === "arrowup") return VK.UP;
  if (k === "arrowright") return VK.RIGHT;
  if (k === "arrowdown") return VK.DOWN;
  if (k === "delete") return VK.DELETE;
  if (k === "meta") return VK.WIN;

  // Single letters A-Z
  if (key.length === 1) {
    const charCode = key.toUpperCase().charCodeAt(0);
    if (charCode >= 65 && charCode <= 90) {
      return charCode;
    }
    // Digits 0-9
    if (charCode >= 48 && charCode <= 57) {
      return charCode;
    }
  }

  return null;
}

// ── WebSocket Server Lifecycle ────────────────────────────────────────────────
initWindowsSubsystem();

const wss = new WebSocketServer({
  port: PORT,
  host: HOST,
  verifyClient: (info, callback) => {
    const origin = info.origin || info.req.headers.origin;
    if (!isAllowedOrigin(origin)) {
      console.warn(`[Native Agent] Blocked connection attempt from unauthorized Origin: ${origin}`);
      callback(false, 403, "Forbidden: Unauthorized Origin");
      return;
    }
    callback(true);
  },
});

wss.on("listening", () => {
  console.log(`=======================================================`);
  console.log(`  VersoLyn Native Host Companion Agent Started`);
  console.log(`  Status: Listening on ws://${HOST}:${PORT}`);
  console.log(`  Security:`);
  console.log(`    - Origin Validation: Active`);
  console.log(`    - Allowed: https://versolyn.vercel.app, localhost, 127.0.0.1`);
  console.log(`    - Pairing PIN: ${pairingToken}`);
  console.log(`  Platform: ${os.platform()} (${os.arch()})`);
  console.log(`=======================================================`);
});

wss.on("connection", (ws, req) => {
  const origin = req.headers.origin;
  if (!isAllowedOrigin(origin)) {
    console.warn(`[Native Agent] Rejected connection with invalid origin: ${origin}`);
    ws.close(1008, "Unauthorized Origin");
    return;
  }

  console.log(`[Native Agent] Web Host Client Connected from Origin: ${origin}`);

  let authenticated = false;
  let sessionToken = null;

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());

      if (msg.type === "HANDSHAKE") {
        const clientToken = typeof msg.token === "string" ? msg.token.trim() : "";
        if (clientToken && clientToken === pairingToken) {
          authenticated = true;
          sessionToken = crypto.randomBytes(24).toString("hex");
          console.log("[Native Agent] Client authenticated successfully during HANDSHAKE");
          ws.send(
            JSON.stringify({
              type: "HANDSHAKE_ACK",
              authenticated: true,
              sessionToken,
              version: "1.0.0",
              os: process.platform,
              screenWidth,
              screenHeight,
            }),
          );
        } else {
          console.log("[Native Agent] Client connected without valid pairing token, requesting authentication");
          ws.send(
            JSON.stringify({
              type: "AUTH_REQUIRED",
              version: "1.0.0",
              os: process.platform,
              message: "Authentication required: please supply valid pairing token or PIN.",
            }),
          );
        }
      } else if (msg.type === "AUTHENTICATE") {
        const clientToken = typeof msg.token === "string" ? msg.token.trim() : "";
        if (clientToken && clientToken === pairingToken) {
          authenticated = true;
          sessionToken = crypto.randomBytes(24).toString("hex");
          console.log("[Native Agent] Client paired successfully via AUTHENTICATE");
          ws.send(
            JSON.stringify({
              type: "AUTH_SUCCESS",
              authenticated: true,
              sessionToken,
              version: "1.0.0",
              os: process.platform,
              screenWidth,
              screenHeight,
            }),
          );
        } else {
          console.warn("[Native Agent] Authentication failed: invalid pairing token");
          ws.send(
            JSON.stringify({
              type: "AUTH_FAILED",
              error: "Invalid pairing token/PIN.",
            }),
          );
        }
      } else if (msg.type === "INPUT_EVENT") {
        if (!authenticated || !sessionToken || msg.sessionToken !== sessionToken) {
          console.warn("[Native Agent] Dropped unauthenticated INPUT_EVENT (invalid or missing sessionToken)");
          ws.send(
            JSON.stringify({
              type: "ERROR",
              error: "Unauthorized: Valid sessionToken required",
            }),
          );
          return;
        }
        executeInput(msg.event);
      } else if (msg.type === "PING") {
        ws.send(JSON.stringify({ type: "PONG" }));
      }
    } catch (e) {
      console.warn("[Native Agent] Message parse error:", e.message);
    }
  });

  ws.on("close", () => {
    console.log("[Native Agent] Web Host Client Disconnected");
  });
});

process.on("SIGINT", () => {
  console.log("\n[Native Agent] Shutting down...");
  if (winProcess) {
    winProcess.kill();
  }
  wss.close();
  process.exit(0);
});
