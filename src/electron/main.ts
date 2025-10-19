import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "path";
import { getStaticData, pollResources } from "./resourceManager.js";
import { ipcHandle } from "./utils.js";

let mainWindow: Electron.BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(app.getAppPath(), "dist-electron/preload.cjs"),
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "dist-react/index.html"));
  }
}

app.on("ready", createWindow);

app.whenReady().then(() => {
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  mainWindow.on("close", (e) => {
    e.preventDefault();
    if (process.platform !== "darwin") {
      mainWindow.hide();
    } else if (app.dock) {
      app.dock.hide();
    }
  });

  const tray = new Tray(path.join(app.getAppPath(), "electron.png"));

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Show App",
        click: () => {
          mainWindow.show();
          if (app.dock) {
            app.dock.show();
          }
        },
      },
      {
        label: "Quit",
        click: () => {
          app.quit();
        },
      },
    ])
  );

  tray.on("double-click", () => {
    mainWindow.show();
  });

  pollResources(mainWindow);

  ipcHandle("get-static-data", () => {
    return getStaticData();
  });
});
