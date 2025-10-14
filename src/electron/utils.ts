import { ipcMain } from "electron";

// making the ipc functions type safe
//

export function ipcHandle<EventName extends keyof EventPayloads>(
  eventName: EventName,
  handler: () => EventPayloads[EventName]
) {
  ipcMain.handle(eventName, () => handler());
}

export function ipcSend<EventName extends keyof EventPayloads>(
  eventName: EventName,
  webContents: Electron.WebContents,
  payload: EventPayloads[EventName]
) {
  webContents.send(eventName, payload);
}
