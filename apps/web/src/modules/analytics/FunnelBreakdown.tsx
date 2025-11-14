import React, { useId } from 'react';
import { FunnelStage } from './types';

interface FunnelBreakdownProps {
  stages: FunnelStage[];
}

const FunnelBreakdown: React.FC<FunnelBreakdownProps> = ({ stages }) => {
  const topValue = Math.max(...stages.map((stage) => stage.value), 1);
  const headingId = useId();
  const descriptionId = `${headingId}-description`;

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
    >
      <header className="mb-4">
        <h2 id={headingId} className="text-xl font-semibold text-slate-900">
          Engagement Funnel
        </h2>
        <p id={descriptionId} className="text-sm text-slate-500">
          Diagnose drop-off between discovery, quest engagement, and social conversion.
        </p>
      </header>
      <ul className="space-y-3" role="list">
        {stages.map((stage, index) => {
          const completion = Math.round((stage.value / topValue) * 100);
          const width = `${completion}%`;
          const delta = stage.delta;
          return (
            <li key={stage.id} className="space-y-1" aria-labelledby={`${stage.id}-label`}>
              <div
                id={`${stage.id}-label`}
                className="flex items-center justify-between text-sm text-slate-600"
              >
                <span className="font-medium text-slate-700">
                  {index + 1}. {stage.label}
                </span>
                <span aria-label={`${stage.value} participants`}>{stage.value.toLocaleString()}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100" role="presentation">
                <div
                  className="h-full rounded-full bg-purple-400"
                  style={{ width }}
                  role="img"
                  aria-label={`${stage.label} completion ${completion}%`}
                />
              </div>
              {typeof delta === 'number' ? (
                <p
                  className={`text-xs font-semibold ${
                    delta >= 0 ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                  aria-live="polite"
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
