/**
 * Remote Desktop Control Protocol & Types
 * Defines the real-time WebRTC and signaling communication protocol
 * between HOST and CONTROLLER for screen streaming and input execution.
 */

export interface ControllerInfo {
  id: string;
  name: string;
  userAgent: string;
  connectedAt: number;
}

export interface ControllerConnectionRequest {
  requestId: string;
  controllerId: string;
  controllerName: string;
  userAgent: string;
  timestamp: number;
  clientNonce: string;
}

export type HostSessionStatus =
  | "idle"
  | "creating"
  | "waiting_pairing"
  | "pending_approval"
  | "connected"
  | "ended";

export type ControllerConnectionStatus =
  | "disconnected"
  | "connecting"
  | "waiting_approval"
  | "connected"
  | "reconnecting"
  | "error";

export interface RemoteDesktopSession {
  sessionId: string;
  pin: string;
  createdAt: number;
  status: HostSessionStatus;
  connectedController?: ControllerInfo;
}

export type InputEventType =
  | "MOUSE_MOVE"
  | "MOUSE_DOWN"
  | "MOUSE_UP"
  | "DOUBLE_CLICK"
  | "MOUSE_WHEEL"
  | "KEY_DOWN"
  | "KEY_UP"
  | "SHORTCUT"
  | "CLIPBOARD_PASTE"
  | "PING"
  | "PONG"
  | "QUALITY_CHANGE";

export type ShortcutAction =
  | "COPY"
  | "PASTE"
  | "ALT_TAB"
  | "TASK_MANAGER"
  | "ESC"
  | "WIN"
  | "ENTER"
  | "BACKSPACE"
  | "CTRL_ALT_DEL";

export interface RemoteDesktopInputEvent {
  type: InputEventType;
  // Mouse coordinates normalized to [0, 1] relative to the stream dimensions
  u?: number;
  v?: number;
  // 0 = primary/left, 1 = auxiliary/middle, 2 = secondary/right
  button?: 0 | 1 | 2;
  // Wheel deltas
  deltaX?: number;
  deltaY?: number;
  // Keyboard details
  key?: string;
  code?: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  // Shortcut action
  shortcut?: ShortcutAction;
  // Clipboard text
  text?: string;
  // Latency measurement
  timestamp?: number;
  // Quality configuration
  quality?: QualityPreset;
}

export type QualityPreset = "auto" | "high" | "medium" | "low";
export type ZoomLevel = "fit" | "100%" | "125%" | "150%";

export interface RemoteDesktopMetrics {
  fps: number;
  rtt: number; // Round-trip time in milliseconds
  bitrateKbps: number;
  packetsLost: number;
  quality: "excellent" | "good" | "fair" | "poor";
  streamWidth: number;
  streamHeight: number;
}

export type SignalingMessageType =
  | "PAIRING_REQUEST"
  | "PAIRING_APPROVAL"
  | "PAIRING_REJECTION"
  | "WEBRTC_OFFER"
  | "WEBRTC_ANSWER"
  | "ICE_CANDIDATE"
  | "SESSION_TERMINATED"
  | "HOST_SCREEN_STATE";

export interface SignalingMessage {
  type: SignalingMessageType;
  sessionId: string;
  sender: "host" | "controller";
  senderId: string;
  payload: any;
  timestamp: number;
}

export interface NativeAgentStatus {
  connected: boolean;
  version?: string;
  os?: string;
  screenWidth?: number;
  screenHeight?: number;
  lastPing?: number;
}
