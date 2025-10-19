import { app } from "electron";
import { getStaticData, pollResources } from "./resourceManager.js";
import { ipcHandle } from "./utils.js";
import { createWindow, handleClose, mainWindow } from "./platform/window.js";
import { createTray } from "./platform/tray.js";

app.whenReady().then(() => {
  createWindow();
  createTray();
  handleClose();

  pollResources(mainWindow);

  ipcHandle("get-static-data", () => {
    return getStaticData();
  });
});
