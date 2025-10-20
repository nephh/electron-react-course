import osUtils from "os-utils";
import os from "os";
import fs from "fs";
import { validatedIpcMain } from "./ipcMain";
import { win } from "./platform/window";

const POLL_INTERVAL = 500; // in ms

export function pollResources() {
  setInterval(async () => {
    const cpuUsage = (await getCPUUsage()) * 100;
    const ramUsage = getRAMUsage() * 100;
    const diskUsage = getDiskUsage();
    validatedIpcMain.send("stats-update", win.webContents, {
      cpuUsage,
      ramUsage,
      diskUsage,
    });
  }, POLL_INTERVAL);
}

export function getStaticData() {
  const totalStorage = getDiskUsage().total;
  const cpuModel = os.cpus()[0].model;
  const totalMem = Math.floor(os.totalmem() / 1_000_000_000) + " GB";
  const platform = os.platform();

  return {
    totalStorage,
    cpuModel,
    totalMem,
    platform,
  };
}

function getCPUUsage(): Promise<number> {
  return new Promise((resolve) => {
    osUtils.cpuUsage(resolve);
  });
}

function getRAMUsage() {
  return 1 - osUtils.freememPercentage();
}

function getDiskUsage() {
  const stats = fs.statfsSync(process.platform === "win32" ? "C:\\" : "/");
  const total = stats.blocks * stats.bsize;
  const free = stats.bfree * stats.bsize;
  return {
    total: Math.floor(total / 1_000_000_000) + " GB", // in GB
    usage: ((1 - free / total) * 100).toFixed(2) + "%", // as a percentage
    gbUsed: Math.floor((total - free) / 1_000_000_000) + " GB", // in GB
  };
}
