import { app, BrowserWindow } from "electron";
import path from "path";

export let mainWindow: BrowserWindow;

export function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(app.getAppPath(), "dist-electron/preload.js"),
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), `dist-react/index.html`));
  }
}

export function handleClose() {
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

  let willClose = false;

  app.on("before-quit", () => {
    willClose = true;
  });

  mainWindow.on("show", () => {
    willClose = false;
  });

  mainWindow.on("close", (e) => {
    if (willClose) {
      return;
    }

    e.preventDefault();
    if (process.platform !== "darwin") {
      mainWindow.hide();
    } else if (app.dock) {
      app.dock.hide();
    }
  });
}
