import React from 'react';
import QuestLog from './QuestLog';
import AchievementGallery from './AchievementGallery';
import { AchievementBadgeProps, QuestCardProps, StreakBadgeProps } from './types';

interface ProgressionDashboardProps {
  quests: QuestCardProps[];
  streaks: StreakBadgeProps[];
  achievements: AchievementBadgeProps[];
}

const ProgressionDashboard: React.FC<ProgressionDashboardProps> = ({
  quests,
  streaks,
  achievements,
}) => {
  return (
    <div className="space-y-10">
      <QuestLog quests={quests} streaks={streaks} />
      <AchievementGallery achievements={achievements} />
    </div>
  );
};

export default ProgressionDashboard;
