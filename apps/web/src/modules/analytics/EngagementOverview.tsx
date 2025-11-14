import React from 'react';
import { EngagementSnapshot } from './types';

interface EngagementOverviewProps {
  snapshot: EngagementSnapshot;
}

const numberFormatter = new Intl.NumberFormat();

const EngagementOverview: React.FC<EngagementOverviewProps> = ({ snapshot }) => {
  const metrics = [
    {
      label: 'Active Players',
      value: numberFormatter.format(snapshot.activeUsers),
      description: 'Unique players with sessions in the last 24 hours.',
    },
    {
      label: 'Returning Players',
      value: numberFormatter.format(snapshot.returningUsers),
      description: 'Players who logged in at least three days this week.',
    },
    {
      label: 'Avg. Session Length',
      value: `${snapshot.averageSessionLength.toFixed(1)} min`,
      description: 'Median playtime per session across all queues.',
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-5">
        <h2 className="text-2xl font-semibold text-slate-900">Engagement Snapshot</h2>
        <p className="text-sm text-slate-500">
          Monitor player health metrics to align events, drops, and quest pacing.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
            <p className="text-xs text-slate-400">{metric.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EngagementOverview;
