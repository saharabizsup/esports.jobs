import React from 'react';
import QuestCard from './QuestCard';
import { QuestCardProps, StreakBadgeProps } from './types';

interface QuestLogProps {
  quests: QuestCardProps[];
  streaks: StreakBadgeProps[];
}

const streakCopy: Record<string, string> = {
  dailyLogin: 'Daily Login',
  matchesPlayed: 'Matches Played',
  wins: 'Win Streak',
};

const QuestLog: React.FC<QuestLogProps> = ({ quests, streaks }) => {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Quest Log</h2>
        <p className="text-sm text-slate-500">
          Track your active objectives, review your streaks, and claim rewards for staying engaged.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {quests.map((quest) => (
          <QuestCard key={quest.id} {...quest} />
        ))}
      </div>
      <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Streaks
        </h3>
        <div className="mt-3 flex flex-wrap gap-4">
          {streaks.map((streak) => (
            <div key={`${streak.category}-${streak.lastIncrementedAt}`} className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
              <span className="text-sm font-semibold text-indigo-600">
                {streak.count}x
              </span>
              <div className="text-xs text-slate-500">
                <p className="font-medium text-slate-700">
                  {streakCopy[streak.category] ?? streak.category}
                </p>
                <p>Updated {new Date(streak.lastIncrementedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
};

export default QuestLog;
