import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  ResponsiveContainer
} from 'recharts';

interface FlowChartProps {
  data: Array<{
    date: string;
    Criados: number;
    Concluídos: number;
  }>;
}

const FlowChart: React.FC<FlowChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 16, left: 8, bottom: 8 }}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <ChartTooltip />
          <ChartLegend />
          <Bar dataKey="Criados" fill="#2563eb" name="Criados" />
          <Bar dataKey="Concluídos" fill="#22c55e" name="Concluídos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FlowChart; 