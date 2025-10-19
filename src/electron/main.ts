import { app } from "electron";
import { getStaticData, pollResources } from "./resourceManager.js";
import { ipcHandle } from "./utils.js";
import {
  createWindow,
  handleClose,
  mainWindow,
} from "./helpers/window.js";
import { createTray } from "./helpers/tray.js";

app.on("ready", createWindow);

app.whenReady().then(() => {
  createTray(mainWindow);

  handleClose(mainWindow);

  pollResources(mainWindow);

  ipcHandle("get-static-data", () => {
    return getStaticData();
  });
});
