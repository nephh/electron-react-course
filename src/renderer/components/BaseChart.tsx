import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type BaseChartProps = {
  data: { value: number | undefined }[];
  maxDataPoints: number;
};

export function BaseChart({ data, maxDataPoints }: BaseChartProps) {
  // pad data to ensure consistent number of points
  const preparedData = useMemo(() => {
    return [...data, ...Array.from({ length: maxDataPoints - data.length })];
  }, [data, maxDataPoints]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={preparedData}>
        <CartesianGrid stroke="#333" strokeDasharray="5 5" fill="1C1C1C" />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#5DD4EE"
          strokeWidth={3}
          fill="#0A4D5C"
          fillOpacity={0.3}
          isAnimationActive={false}
          dot={false}
        />
        <XAxis stroke="transparent" height={5} />
        <YAxis stroke="transparent" domain={[0, 100]} width={0} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
