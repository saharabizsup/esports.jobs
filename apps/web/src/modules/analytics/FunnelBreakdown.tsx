import React from 'react';
import { FunnelStage } from './types';

interface FunnelBreakdownProps {
  stages: FunnelStage[];
}

const FunnelBreakdown: React.FC<FunnelBreakdownProps> = ({ stages }) => {
  const topValue = Math.max(...stages.map((stage) => stage.value), 1);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Engagement Funnel</h2>
        <p className="text-sm text-slate-500">
          Diagnose drop-off between discovery, quest engagement, and social conversion.
        </p>
      </header>
      <ul className="space-y-3">
        {stages.map((stage, index) => {
          const width = `${(stage.value / topValue) * 100}%`;
          const delta = stage.delta;
          return (
            <li key={stage.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span className="font-medium text-slate-700">
                  {index + 1}. {stage.label}
                </span>
                <span>{stage.value.toLocaleString()}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-purple-400" style={{ width }} />
              </div>
              {typeof delta === 'number' ? (
                <p
                  className={`text-xs font-semibold ${
                    delta >= 0 ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {delta >= 0 ? '+' : ''}
                  {delta}% vs. last week
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default FunnelBreakdown;
