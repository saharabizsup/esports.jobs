import React from 'react';
import { AchievementBadgeProps } from './types';

interface AchievementGalleryProps {
  achievements: AchievementBadgeProps[];
}

const AchievementGallery: React.FC<AchievementGalleryProps> = ({ achievements }) => {
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Achievements</h2>
        <p className="text-sm text-slate-500">
          Celebrate your milestones. Progress bars update live as you advance through tiers.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {achievements.map((achievement) => (
          <article
            key={achievement.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <span className="text-lg font-semibold">{achievement.icon}</span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {achievement.title}
                </h3>
                <p className="text-xs text-slate-500">{achievement.tierLabel ?? 'Tier progress'}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600">{achievement.description}</p>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${achievement.progressPercentage}%` }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={achievement.progressPercentage}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AchievementGallery;
