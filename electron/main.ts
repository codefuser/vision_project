import { app, BrowserWindow, shell, ipcMain, nativeTheme, Menu } from "electron";
import path from "path";

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

app.setAppUserModelId("VersoLyn");
app.setName("VersoLyn");

// Completely remove default application menu bar (File, Edit, View, Window, Help)
Menu.setApplicationMenu(null);

let mainWindow: BrowserWindow | null = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: "VersoLyn",
    icon: path.join(__dirname, "../../build/icon.ico"),
    backgroundColor: "#0a0a14",
    show: false,
    frame: true,
    autoHideMenuBar: true,
    menuBarVisible: false,
    titleBarStyle: "default",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });

  mainWindow.setMenu(null);

  // Load renderer
  const rendererPath = path.join(__dirname, "../renderer/index.electron.html");
  mainWindow.loadFile(rendererPath);

  // Show window smoothly when DOM content is ready
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
    mainWindow?.focus();
    // Open DevTools ONLY during development (never in production packaged EXE)
    if (!app.isPackaged) {
      mainWindow?.webContents.openDevTools({ mode: "detach" });
    }
  });

  // F11 Fullscreen Toggle & ESC Exit Fullscreen
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.type === "keyDown") {
      if (input.key === "F11") {
        event.preventDefault();
        const isFS = mainWindow?.isFullScreen() ?? false;
        mainWindow?.setFullScreen(!isFS);
      } else if (input.key === "Escape") {
        if (mainWindow?.isFullScreen()) {
          event.preventDefault();
          mainWindow?.setFullScreen(false);
        }
      }
    }
  });

  // Open external links in default browser, allow local child windows (e.g. projector)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return {
      action: "allow",
      overrideBrowserWindowOptions: {
        autoHideMenuBar: true,
        frame: true,
        webPreferences: {
          preload: path.join(__dirname, "preload.cjs"),
          contextIsolation: true,
          nodeIntegration: false,
        },
      },
    };
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
