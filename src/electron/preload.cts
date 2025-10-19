const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getSystemStats: (callback) => {
    return ipcOn("stats-update", (_, stats) => callback(stats));
  },
  getStaticData: () => ipcInvoke("get-static-data"),
} satisfies Window["api"]);

// creating wrappers to make the ipc functions type safe
// must be declared in preload script
//
function ipcOn<EventName extends keyof EventPayloads>(
  eventName: EventName,
  callback: (
    event: Electron.IpcRendererEvent,
    payload: EventPayloads[EventName]
  ) => void
) {
  ipcRenderer.on(eventName, callback);
  return () => ipcRenderer.off(eventName, callback);
}

function ipcInvoke<EventName extends keyof EventPayloads>(
  eventName: EventName
): Promise<EventPayloads[EventName]> {
  return ipcRenderer.invoke(eventName);
}
