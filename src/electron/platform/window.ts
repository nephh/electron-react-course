import { app, BrowserWindow } from "electron";
import path from "path";

export let win: BrowserWindow;

export async function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      preload: path.join(app.getAppPath(), "dist-electron/preload.js"),
    },
    icon: undefined,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#202020",
      symbolColor: "#74b1be",
      height: 32,
    },
    backgroundColor: "#242424",
    title: "Simple Resource Monitor",
  });

  if (process.env.NODE_ENV === "development") {
    // NOTE: make `createWindow` async (change `export function createWindow()` to `export async function createWindow()`)
    // wait once for 3000 ms before continuing
    win.loadURL("http://localhost:5173");
    // win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(app.getAppPath(), `dist-react/index.html`));
  }
}

export function handleClose() {
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  // app.on("window-all-closed", () => {
  //   if (process.platform !== "darwin") {
  //     app.quit();
  //   }
  // });

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

  win.on("show", () => {
    willClose = false;
  });

  win.on("close", (e) => {
    if (willClose) {
      return;
    }

    e.preventDefault();
    win.hide();
  });
}
