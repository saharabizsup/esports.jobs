import React from 'react';
import { HeatmapCell } from './types';

interface HeatmapProps {
  title: string;
  cells: HeatmapCell[];
}

const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Heatmap: React.FC<HeatmapProps> = ({ title, cells }) => {
  const maxValue = Math.max(...cells.map((cell) => cell.value), 1);
  const buckets = cells.reduce<Record<string, Record<number, number>>>((acc, cell) => {
    acc[cell.day] = acc[cell.day] ?? {};
    acc[cell.day][cell.hour] = cell.value;
    return acc;
  }, {});

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">
          Identify prime time windows for events, drops, and live broadcasts.
        </p>
      </header>
      <div className="grid grid-cols-8 gap-2 text-xs">
        <span className="text-slate-400" />
        {Array.from({ length: 7 }).map((_, index) => (
          <span key={index} className="text-center text-slate-400">
            {index * 4}:00
          </span>
        ))}
        {dayOrder.map((day) => (
          <React.Fragment key={day}>
            <span className="self-center text-slate-400">{day}</span>
            {Array.from({ length: 7 }).map((_, index) => {
              const hour = index * 4;
              const value = buckets[day]?.[hour] ?? 0;
              const intensity = value / maxValue;
              const background = `rgba(79, 70, 229, ${Math.max(0.1, intensity)})`;
              return (
                <span
                  key={`${day}-${hour}`}
                  className="h-10 w-full rounded-md"
                  style={{ backgroundColor: background }}
                  title={`${day} @ ${hour}:00 — ${value.toLocaleString()} players`}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default Heatmap;
