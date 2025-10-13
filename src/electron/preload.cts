const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getStaticData: () => ipcRenderer.invoke("get-static-data"),
});
