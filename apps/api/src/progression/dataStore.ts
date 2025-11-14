import {
  Achievement,
  AchievementProgress,
  Quest,
  QuestProgress,
  Streak,
} from './models';

const now = new Date().toISOString();

export const quests: Quest[] = [
  {
    id: 'quest-1',
    title: 'Win Three Ranked Matches',
    summary: 'Secure three victories in ranked play to earn a competitive flair.',
    category: 'weekly',
    difficulty: 'competitive',
    steps: [
      { id: 'step-1', description: 'Win your first ranked match', target: 1 },
      { id: 'step-2', description: 'Win your second ranked match', target: 2 },
      { id: 'step-3', description: 'Win your third ranked match', target: 3 },
    ],
    reward: { experience: 1500, currency: 250 },
    expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
  },
  {
    id: 'quest-2',
    title: 'Party Support Specialist',
    summary: 'Provide assists while queued with your party.',
    category: 'daily',
    difficulty: 'casual',
    steps: [
      {
        id: 'step-4',
        description: 'Earn 10 assists while in a party',
        target: 10,
      },
    ],
    reward: { experience: 600 },
  },
];

export const questProgress: QuestProgress[] = [
  {
    questId: 'quest-1',
    userId: 'user-123',
    completedStepIds: ['step-1'],
    stepProgress: { 'step-1': 1, 'step-2': 1, 'step-3': 0 },
  },
  {
    questId: 'quest-2',
    userId: 'user-123',
    completedStepIds: [],
    stepProgress: { 'step-4': 4 },
  },
];

export const streaks: Streak[] = [
  {
    userId: 'user-123',
    category: 'dailyLogin',
    count: 12,
    lastIncrementedAt: now,
  },
  {
    userId: 'user-123',
    category: 'matchesPlayed',
    count: 5,
    lastIncrementedAt: now,
  },
];

export const achievements: Achievement[] = [
  {
    id: 'achv-1',
    title: 'Clutch Captain',
    description: 'Win matches while being the last surviving party member.',
    category: 'skill',
    icon: 'trophy-gold',
    tiers: [
      {
        id: 'achv-1-tier-1',
        name: 'Bronze Clutch',
        requirement: 'Win 3 clutch matches',
        points: 50,
      },
      {
        id: 'achv-1-tier-2',
        name: 'Silver Clutch',
        requirement: 'Win 10 clutch matches',
        points: 120,
      },
    ],
  },
  {
    id: 'achv-2',
    title: 'Party Leader',
    description: 'Queue with a full party 20 times.',
    category: 'social',
    icon: 'party-leader',
    tiers: [
      {
        id: 'achv-2-tier-1',
        name: 'Party Starter',
        requirement: 'Queue with a full party 5 times',
        points: 40,
      },
      {
        id: 'achv-2-tier-2',
        name: 'Party Regular',
        requirement: 'Queue with a full party 20 times',
        points: 100,
      },
    ],
  },
];

export const achievementProgress: AchievementProgress[] = [
  {
    achievementId: 'achv-1',
    userId: 'user-123',
    currentTierId: 'achv-1-tier-1',
    points: 55,
    unlockedAt: now,
  },
  {
    achievementId: 'achv-2',
    userId: 'user-123',
    points: 15,
  },
];
