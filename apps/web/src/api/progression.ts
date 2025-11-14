import type {
  AchievementBadgeProps,
  QuestCardProps,
  StreakBadgeProps,
} from '../modules/progression';

interface QuestStepResponse {
  id: string;
  description: string;
  target: number;
}

interface QuestResponseItem {
  id: string;
  title: string;
  summary: string;
  category: 'daily' | 'weekly' | 'seasonal';
  difficulty: 'casual' | 'competitive' | 'hardcore';
  steps: QuestStepResponse[];
  reward: {
    experience: number;
    currency?: number;
    cosmeticItemId?: string;
  };
  expiresAt?: string;
}

interface QuestProgressResponse {
  questId: string;
  userId: string;
  completedStepIds: string[];
  stepProgress: Record<string, number>;
}

interface StreakResponse {
  userId: string;
  category: string;
  count: number;
  lastIncrementedAt: string;
}

interface AchievementTierResponse {
  id: string;
  name: string;
  requirement: string;
  points: number;
}

interface AchievementResponseItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  tiers: AchievementTierResponse[];
}

interface AchievementProgressResponse {
  achievementId: string;
  userId: string;
  currentTierId?: string;
  points: number;
  unlockedAt?: string;
}

interface QuestLogResponse {
  quests: QuestResponseItem[];
  progress: QuestProgressResponse[];
  streaks: StreakResponse[];
}

interface AchievementLogResponse {
  achievements: AchievementResponseItem[];
  progress: AchievementProgressResponse[];
}

export interface ProgressionSummary {
  quests: QuestCardProps[];
  streaks: StreakBadgeProps[];
  achievements: AchievementBadgeProps[];
}

const rewardFormatter = new Intl.NumberFormat();

function formatReward(reward: QuestResponseItem['reward']): string {
  const parts: string[] = [];

  if (Number.isFinite(reward.experience)) {
    parts.push(`${rewardFormatter.format(reward.experience)} XP`);
  }

  if (reward.currency) {
    parts.push(`${rewardFormatter.format(reward.currency)} Credits`);
  }

  if (reward.cosmeticItemId) {
    parts.push(`Cosmetic: ${reward.cosmeticItemId}`);
  }

  return parts.join(' • ');
}

const achievementIconMap: Record<string, string> = {
  'trophy-gold': '🏆',
  'party-leader': '🎉',
  'event-champion': '🎟️',
  strategist: '🧠',
  support: '🛡️',
};

function mapAchievementIcon(icon: string): string {
  return achievementIconMap[icon] ?? '⭐';
}

function mapQuest(
  quest: QuestResponseItem,
  userProgress?: QuestProgressResponse,
): QuestCardProps {
  return {
    id: quest.id,
    title: quest.title,
    summary: quest.summary,
    category: quest.category,
    difficulty: quest.difficulty,
    reward: formatReward(quest.reward),
    steps: quest.steps.map((step) => ({
      id: step.id,
      description: step.description,
      target: step.target,
      value: userProgress?.stepProgress?.[step.id] ?? 0,
    })),
    expiresAt: quest.expiresAt,
  };
}

function mapAchievement(
  achievement: AchievementResponseItem,
  progress?: AchievementProgressResponse,
): AchievementBadgeProps {
  const points = progress?.points ?? 0;
  const highestTier = achievement.tiers.reduce<AchievementTierResponse | undefined>((acc, tier) => {
    if (!acc || tier.points > acc.points) {
      return tier;
    }
    return acc;
  }, undefined);
  const divisor = highestTier?.points ?? Math.max(points, 1);
  const percentage = Math.min(100, Math.round((points / divisor) * 100));
  const activeTier = progress?.currentTierId
    ? achievement.tiers.find((tier) => tier.id === progress.currentTierId)
    : undefined;

  return {
    id: achievement.id,
    title: achievement.title,
    description: achievement.description,
    icon: mapAchievementIcon(achievement.icon),
    progressPercentage: Number.isFinite(percentage) ? percentage : 0,
    tierLabel: activeTier?.name ?? (achievement.tiers[0] ? `Next: ${achievement.tiers[0].name}` : undefined),
  };
}

function mapStreak(streak: StreakResponse): StreakBadgeProps {
  return {
    category: streak.category,
    count: streak.count,
    lastIncrementedAt: streak.lastIncrementedAt,
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchProgressionSummary(
  baseUrl: string,
  userId: string,
): Promise<ProgressionSummary> {
  const [questLog, achievementLog] = await Promise.all<[
    QuestLogResponse,
    AchievementLogResponse,
  ]>([
    fetchJson<QuestLogResponse>(`${baseUrl}/progression/quests?userId=${encodeURIComponent(userId)}`),
    fetchJson<AchievementLogResponse>(`${baseUrl}/progression/achievements?userId=${encodeURIComponent(userId)}`),
  ]);

  const quests = questLog.quests.map((quest) =>
    mapQuest(quest, questLog.progress.find((progress) => progress.questId === quest.id)),
  );

  const streaks = questLog.streaks.map(mapStreak);

  const achievements = achievementLog.achievements.map((achievement) =>
    mapAchievement(
      achievement,
      achievementLog.progress.find((progress) => progress.achievementId === achievement.id),
    ),
  );

  return { quests, streaks, achievements };
}
