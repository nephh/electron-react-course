import { app, ipcMain } from "electron";
import path from "path/win32";
import { pathToFileURL } from "url";

// create wrappers to make the ipc functions type safe
//

export function ipcHandle<EventName extends keyof EventPayloads>(
  eventName: EventName,
  handler: () => EventPayloads[EventName]
) {
  ipcMain.handle(eventName, (event) => {
    validateEventUrl(event.senderFrame!.url);
    return handler();
  });
}

export function ipcSend<EventName extends keyof EventPayloads>(
  eventName: EventName,
  webContents: Electron.WebContents,
  payload: EventPayloads[EventName]
) {
  webContents.send(eventName, payload);
}

export function validateEventUrl(url: string) {
  if (
    process.env.NODE_ENV === "development" &&
    new URL(url).host === "localhost:5173"
  ) {
    return;
  } else if (
    url !==
    pathToFileURL(
      path.join(app.getAppPath(), "dist-react/index.html")
    ).toString()
  ) {
    throw new Error("Unauthorized event");
  }
}
