import React from 'react';
import { QuestCardProps } from './types';

const difficultyColor: Record<QuestCardProps['difficulty'], string> = {
  casual: 'bg-green-100 text-green-800',
  competitive: 'bg-blue-100 text-blue-800',
  hardcore: 'bg-red-100 text-red-800',
};

const QuestCard: React.FC<QuestCardProps> = ({
  title,
  summary,
  category,
  difficulty,
  reward,
  steps,
  expiresAt,
}) => {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {category} quest
          </p>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyColor[difficulty]}`}>
          {difficulty}
        </span>
      </header>
      <p className="mb-4 text-sm text-slate-600">{summary}</p>
      <ul className="space-y-3">
        {steps.map((step) => {
          const percent = Math.min(100, Math.round((step.value / step.target) * 100));
          return (
            <li key={step.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>{step.description}</span>
                <span>
                  {step.value}/{step.target}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${percent}%` }}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                  role="progressbar"
                />
              </div>
            </li>
          );
        })}
      </ul>
      <footer className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>Rewards: {reward}</span>
        {expiresAt ? <time>Expires {new Date(expiresAt).toLocaleDateString()}</time> : null}
      </footer>
    </article>
  );
};

export default QuestCard;
