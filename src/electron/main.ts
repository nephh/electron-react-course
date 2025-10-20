import { app } from "electron";
import { getStaticData, pollResources } from "./resourceManager";
import { validatedIpcMain } from "./ipcMain";
import { createWindow, handleClose } from "./platform/window";
import { createTray } from "./platform/tray";

app.whenReady().then(() => {
  createWindow();
  createTray();
  handleClose();
  pollResources();

  validatedIpcMain.handle("get-static-data", () => {
    return getStaticData();
  });
});
