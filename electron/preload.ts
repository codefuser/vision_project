import { contextBridge, ipcRenderer } from "electron";

// Expose a minimal, secure API to the renderer via window.electronAPI
contextBridge.exposeInMainWorld("electronAPI", {
  getSystemTheme: (): Promise<"dark" | "light"> =>
    ipcRenderer.invoke("get-system-theme"),

  getAppVersion: (): Promise<string> =>
    ipcRenderer.invoke("get-app-version"),

  isElectron: true,
});
