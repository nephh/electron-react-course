import { app } from "electron";
import { getStaticData, pollResources } from "./resourceManager";
import { ipcHandle } from "./utils";
import { createWindow, handleClose } from "./platform/window";
import { createTray } from "./platform/tray";

app.on("ready", createWindow);

app.whenReady().then(() => {
  handleClose();

  createTray();

  pollResources();

  ipcHandle("get-static-data", () => {
    return getStaticData();
  });
});
