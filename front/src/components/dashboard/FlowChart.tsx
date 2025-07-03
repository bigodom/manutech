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
    Abertos: number;
  }>;
}

const FlowChart: React.FC<FlowChartProps> = ({ data }) => {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ 
            top: 16, 
            right: 16, 
            left: 8, 
            bottom: 8 
          }}
        >
          <XAxis 
            dataKey="date" 
            fontSize={12}
            tick={{ fontSize: 12 }}
            interval={window.innerWidth < 640 ? 1 : 0}
          />
          <YAxis 
            allowDecimals={false} 
            fontSize={12}
            tick={{ fontSize: 12 }}
            width={40}
          />
          <ChartTooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          <ChartLegend 
            wrapperStyle={{ fontSize: '14px' }}
          />
          <Bar dataKey="Criados" fill="#2563eb" name="Criados" radius={[2, 2, 0, 0]} />
          <Bar dataKey="Concluídos" fill="#22c55e" name="Concluídos" radius={[2, 2, 0, 0]} />
          <Bar dataKey="Abertos" fill="#f59e0b" name="Abertos" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FlowChart; 