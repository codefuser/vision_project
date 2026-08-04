import { app, BrowserWindow, shell, ipcMain, nativeTheme } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

app.setAppUserModelId("VersoLyn");
app.setName("VersoLyn");

let mainWindow: BrowserWindow | null = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: "VersoLyn",
    icon: path.join(__dirname, "../build/icon.ico"),
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#0a0a14" : "#ffffff",
    show: false, // show after ready-to-show for smooth startup
    frame: true,
    titleBarStyle: "default",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });

  // Load renderer
  const rendererPath = path.join(__dirname, "../renderer/index.electron.html");
  mainWindow.loadFile(rendererPath);

  // Show window when ready for a smooth startup
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  // Open external links in default browser, not inside Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Bring existing instance to front when second instance is launched
app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on("ready", () => {
  createMainWindow();
});

app.on("window-all-closed", () => {
  // On Windows/Linux, quit when all windows closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// IPC: theme detection
ipcMain.handle("get-system-theme", () => {
  return nativeTheme.shouldUseDarkColors ? "dark" : "light";
});

// IPC: app version
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});
