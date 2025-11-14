import React from 'react';
import { TrendPoint } from './types';

interface TrendLineProps {
  title: string;
  points: TrendPoint[];
}

const TrendLine: React.FC<TrendLineProps> = ({ title, points }) => {
  const maxValue = Math.max(...points.map((point) => point.value), 1);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <span className="text-xs uppercase tracking-wide text-slate-400">
          Last 14 days
        </span>
      </header>
      <div className="relative h-48 w-full">
        <svg viewBox="0 0 400 160" className="h-full w-full">
          <polyline
            fill="none"
            stroke="url(#trendGradient)"
            strokeWidth="3"
            points={points
              .map((point, index) => {
                const x = (index / Math.max(points.length - 1, 1)) * 400;
                const y = 160 - (point.value / maxValue) * 140 - 10;
                return `${x},${y}`;
              })
              .join(' ')}
          />
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2 text-xs text-slate-400">
        {points.map((point) => (
          <span key={point.timestamp} className="truncate">
            {new Date(point.timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        ))}
      </div>
    </section>
  );
};

export default TrendLine;
