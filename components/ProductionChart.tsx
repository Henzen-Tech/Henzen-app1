
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { HistoryEvent } from '../types';

interface ProductionChartProps {
  storico?: Record<string, HistoryEvent>;
}

const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

const ProductionChart: React.FC<ProductionChartProps> = ({ storico }) => {
  const chartData = useMemo(() => {
    if (!storico) return [];

    // Fix: Explicitly cast the values to HistoryEvent[] to avoid "unknown" type errors
    const allEvents = Object.values(storico) as HistoryEvent[];

    // Filter only egg events
    const eggEvents = allEvents.filter((e) => e.evento === 'UOVO');

    // Define working hours 06:00 - 20:00
    const hours = Array.from({ length: 15 }, (_, i) => {
      const h = (i + 6).toString().padStart(2, '0');
      return `${h}:00`;
    });

    // Identify unique chickens for stack colors
    const chickensSet = new Set<string>();
    eggEvents.forEach((e) => chickensSet.add(e.dettagli));
    const chickens = Array.from(chickensSet);

    // Map events to data points
    return hours.map((hourLabel) => {
      const dataPoint: any = { hour: hourLabel };
      const [hStr] = hourLabel.split(':');
      const hourInt = parseInt(hStr);

      chickens.forEach((chicken) => {
        const count = eggEvents.filter((e) => {
          const [eventH] = e.ora.split(':');
          return parseInt(eventH) === hourInt && e.dettagli === chicken;
        }).length;
        dataPoint[chicken] = count;
      });

      return dataPoint;
    });
  }, [storico]);

  const uniqueChickens = useMemo(() => {
    if (!storico) return [];
    const set = new Set<string>();
    // Fix: Cast Object.values to HistoryEvent[] to resolve "unknown" type errors on property access
    (Object.values(storico) as HistoryEvent[]).forEach((e) => {
      if (e.evento === 'UOVO') set.add(e.dettagli);
    });
    return Array.from(set);
  }, [storico]);

  return (
    <div className="w-full h-[400px] mt-8 p-4 glass-card rounded-2xl shadow-xl">
      <h3 className="text-xl font-bold mb-6 text-gray-200 px-2">Produzione Oraria (Stacked)</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="hour" 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {uniqueChickens.map((chicken, index) => (
            <Bar
              key={chicken}
              dataKey={chicken}
              stackId="a"
              fill={COLORS[index % COLORS.length]}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductionChart;
