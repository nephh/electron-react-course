const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getSystemStats: (callback) => {
    ipcOn("stats-update", (_, stats) => callback(stats));
  },
  getStaticData: () => ipcInvoke("get-static-data"),
} satisfies Window["api"]);

// creating wrappers to make the ipc functions type safe
// must be declared in preload script
//

function ipcOn<EventName extends keyof EventPayloads>(
  eventName: EventName,
  listener: (
    event: Electron.IpcRendererEvent,
    payload: EventPayloads[EventName]
  ) => void
) {
  ipcRenderer.on(eventName, listener);
}

function ipcInvoke<EventName extends keyof EventPayloads>(
  eventName: EventName
) {
  return ipcRenderer.invoke(eventName);
}
