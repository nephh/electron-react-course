import { app, Menu, Tray } from "electron";
import path from "path";
import { win } from "./window";

const iconPath = path.join(
  app.isPackaged ? process.resourcesPath : app.getAppPath(),
  "src/assets/electron.png"
);

export function createTray() {
  const tray = new Tray(iconPath);

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Open",
        click: () => {
          win.show();
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
    win.show();
  });

  tray.setToolTip("Resource Monitor");
}
