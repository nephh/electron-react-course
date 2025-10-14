const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getSystemStats: (callback: (stats: SystemStats) => void) => {
    ipcRenderer.on("stats-update", (_: Electron.Event, stats: SystemStats) =>
      callback(stats)
    );
  },
  getStaticData: () => ipcRenderer.invoke("get-static-data"),
});
