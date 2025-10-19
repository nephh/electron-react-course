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

type EventPayloads = {
  "stats-update": SystemStats;
  "get-static-data": StaticData;
};

type UnsubscribeFunction = () => void;

interface Window {
  api: {
    getSystemStats: (
      callback: (stats: SystemStats) => void
    ) => UnsubscribeFunction;
    getStaticData: () => Promise<StaticData>;
  };
}
