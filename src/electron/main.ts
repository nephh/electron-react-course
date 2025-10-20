import { app } from "electron";
import { getStaticData, pollResources } from "./resourceManager";
import { ipcHandle } from "./utils";
import { createWindow, handleClose } from "./platform/window";
import { createTray } from "./platform/tray";

app.whenReady().then(() => {
  createWindow();
  createTray();
  handleClose();
  pollResources();

  ipcHandle("get-static-data", () => {
    return getStaticData();
  });
});
