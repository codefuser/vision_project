# VersoLyn Native Host Companion Agent

Lightweight local companion agent for **VersoLyn Remote Desktop Control**.

## Why is this needed?
A standard web browser is sandboxed by design and cannot inject hardware mouse clicks or keystrokes into outside Windows operating system applications (e.g. File Explorer, Windows Settings, Desktop icons, Task Manager, external presentation apps) without a native companion.

This companion agent binds strictly to local loopback (`ws://127.0.0.1:48123`) on the **HOST** laptop. When an authorized controller moves the mouse, clicks, scrolls, or types, the web application forwards the normalized input coordinates to this agent, which executes them at the operating system level.

---

## 🚀 How to Run

### Windows (1-Click):
Double-click `run-agent.bat` or run in terminal:
```cmd
cd native-agent
run-agent.bat
```

### Manual (Any OS):
```bash
cd native-agent
npm install
npm start
```

---

## 🔒 Security Architecture
- **Localhost Only**: Binds strictly to `127.0.0.1`. Does not listen on any external or LAN IP.
- **Explicit Authorization**: Only executes commands forwarded by the VersoLyn Web UI after the operator explicitly clicks **"Approve Connection"**.
- **Instant Cutoff**: Terminating the session or closing the agent immediately cuts all remote input execution.
- **Zero Heavy Build Tools**: Uses native Windows Win32 APIs via PowerShell P/Invoke runner. Does not require Python, Visual Studio C++, or `node-gyp`.
