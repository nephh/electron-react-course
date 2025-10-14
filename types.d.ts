type SystemStats = {
  cpuUsage: number;
  ramUsage: number;
  diskUsage: {
    total: string;
    usage: string;
    gbUsed: string;
  };
};

type StaticData = {
  totalStorage: string;
  cpuModel: string;
  totalMem: string;
  platform: string;
};

interface Window {
  api: {
    getSystemStats: (callback: (stats: SystemStats) => void) => void;
    getStaticData: () => Promise<StaticData>;
  };
}
