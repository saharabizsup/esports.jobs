export type QuestDifficulty = 'casual' | 'competitive' | 'hardcore';

export interface QuestStep {
  id: string;
  description: string;
  target: number;
}

export interface Quest {
  id: string;
  title: string;
  summary: string;
  category: 'daily' | 'weekly' | 'seasonal';
  difficulty: QuestDifficulty;
  steps: QuestStep[];
  reward: {
    experience: number;
    currency?: number;
    cosmeticItemId?: string;
  };
  expiresAt?: string;
}

export interface QuestProgress {
  questId: string;
  userId: string;
  completedStepIds: string[];
  stepProgress: Record<string, number>;
  completedAt?: string;
}

export interface AchievementTier {
  id: string;
  name: string;
  requirement: string;
  points: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'skill' | 'social' | 'longevity' | 'events';
  tiers: AchievementTier[];
  icon: string;
}

export interface AchievementProgress {
  achievementId: string;
  userId: string;
  currentTierId?: string;
  points: number;
  unlockedAt?: string;
}

export interface Streak {
  userId: string;
  category: 'dailyLogin' | 'matchesPlayed' | 'wins';
  count: number;
  lastIncrementedAt: string;
}

export interface QuestLogResponse {
  quests: Quest[];
  progress: QuestProgress[];
  streaks: Streak[];
}

export interface AchievementResponse {
  achievements: Achievement[];
  progress: AchievementProgress[];
}
