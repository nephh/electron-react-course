import { app, Menu, Tray } from "electron";
import path from "path";
import { mainWindow } from "./window.js";

export function createTray() {
  const tray = new Tray(path.join(app.getAppPath(), "electron.png"));

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Open",
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

  tray.on("click", () => {
    mainWindow.show();
  });

  tray.setToolTip("Resource Monitor");
}
