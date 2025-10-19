import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { BaseChart } from "./components/BaseChart";
import reactLogo from "./assets/react.svg";

function App() {
  const [count, setCount] = useState(0);
  function useSystemStats(): SystemStats[] {
    const [value, setValue] = useState<SystemStats[]>([]);

    useEffect(() => {
      // need to make sure we unsub in case this were a
      // component that unmounts/remounts
      const unsub = window.api.getSystemStats((stats) => {
        return setValue((prev) => {
          const newData = [...prev, stats];

          if (newData.length > 10) {
            newData.shift();
          }

          return newData;
        });
      });
      return unsub;
    }, []);

    return value;
  }

  const systemStats = useSystemStats();

  console.log(systemStats);

  const cpuUsageData = useMemo(() => {
    return systemStats.map((stat) => ({ value: stat.cpuUsage }));
  }, [systemStats]);

  return (
    <>
      <div style={{ height: 120 }}>
        <BaseChart data={cpuUsageData} maxDataPoints={10} />
      </div>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
