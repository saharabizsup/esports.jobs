export interface QuestStepProgress {
  id: string;
  description: string;
  target: number;
  value: number;
}

export interface QuestCardProps {
  id: string;
  title: string;
  summary: string;
  category: 'daily' | 'weekly' | 'seasonal';
  difficulty: 'casual' | 'competitive' | 'hardcore';
  reward: string;
  steps: QuestStepProgress[];
  expiresAt?: string;
}

export interface StreakBadgeProps {
  category: string;
  count: number;
  lastIncrementedAt: string;
}

export interface AchievementBadgeProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  progressPercentage: number;
  tierLabel?: string;
}
