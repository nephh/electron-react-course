import { app, ipcMain } from "electron";
import path from "path";
import { pathToFileURL } from "url";

// fancy class to wrap ipcMain for type safety and validate event urls
// vscode github does it similar to this so I wanted to try it
//
class ValidatedIpcMain<EventName extends keyof EventPayloads> {
  on(channel: EventName, handler: (payload: EventPayloads[EventName]) => void) {
    ipcMain.on(channel, (event, payload) => {
      this.validateEventUrl(event.senderFrame!.url);
      return handler(payload);
    });
  }

  handle(channel: EventName, listener: () => EventPayloads[EventName]) {
    ipcMain.handle(channel, (event) => {
      this.validateEventUrl(event.senderFrame!.url);
      return listener();
    });
  }

  send(
    channel: EventName,
    webContents: Electron.WebContents,
    payload: EventPayloads[EventName]
  ) {
    webContents.send(channel, payload);
  }

  private validateEventUrl(url: string) {
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
}

export const validatedIpcMain = new ValidatedIpcMain();

// create wrappers to make the ipc functions type safe
//
// export function ipcHandle<EventName extends keyof EventPayloads>(
//   eventName: EventName,
//   handler: () => EventPayloads[EventName]
// ) {
//   ipcMain.handle(eventName, (event) => {
//     validateEventUrl(event.senderFrame!.url);
//     return handler();
//   });
// }

// export function ipcSend<EventName extends keyof EventPayloads>(
//   eventName: EventName,
//   webContents: Electron.WebContents,
//   payload: EventPayloads[EventName]
// ) {
//   webContents.send(eventName, payload);
// }

// export function validateEventUrl(url: string) {
//   if (
//     process.env.NODE_ENV === "development" &&
//     new URL(url).host === "localhost:5173"
//   ) {
//     return;
//   } else if (
//     url !==
//     pathToFileURL(
//       path.join(app.getAppPath(), "dist-react/index.html")
//     ).toString()
//   ) {
//     throw new Error("Unauthorized event");
//   }
// }
