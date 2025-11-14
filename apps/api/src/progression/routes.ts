import { Request, Response, Router } from 'express';
import {
  achievementProgress,
  achievements,
  questProgress,
  quests,
  streaks,
} from './dataStore';
import {
  AchievementProgress,
  QuestLogResponse,
  AchievementResponse,
} from './models';

const router = Router();

router.get('/quests', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) ?? 'user-123';
  const response: QuestLogResponse = {
    quests,
    progress: questProgress.filter((progress) => progress.userId === userId),
    streaks: streaks.filter((streak) => streak.userId === userId),
  };
  res.json(response);
});

router.post('/quests/:questId/progress', (req: Request, res: Response) => {
  const { questId } = req.params;
  const { userId, stepId, value } = req.body as {
    userId: string;
    stepId: string;
    value: number;
  };

  const progress = questProgress.find(
    (entry) => entry.questId === questId && entry.userId === userId,
  );

  if (!progress) {
    return res.status(404).json({ message: 'Quest progress not found.' });
  }

  progress.stepProgress[stepId] = value;
  const target = quests
    .find((quest) => quest.id === questId)
    ?.steps.find((step) => step.id === stepId)?.target ?? Infinity;

  if (value >= target) {
    if (!progress.completedStepIds.includes(stepId)) {
      progress.completedStepIds.push(stepId);
    }
  }

  res.json(progress);
});

router.get('/achievements', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) ?? 'user-123';
  const response: AchievementResponse = {
    achievements,
    progress: achievementProgress.filter(
      (progress) => progress.userId === userId,
    ),
  };
  res.json(response);
});

router.post(
  '/achievements/:achievementId/progress',
  (req: Request, res: Response) => {
    const { achievementId } = req.params;
    const { userId, points, tierId } = req.body as {
      userId: string;
      points: number;
      tierId?: string;
    };

    let progress = achievementProgress.find(
      (entry) => entry.achievementId === achievementId && entry.userId === userId,
    );

    if (!progress) {
      progress = {
        achievementId,
        userId,
        points,
        currentTierId: tierId,
      } as AchievementProgress;
      achievementProgress.push(progress);
    } else {
      progress.points = points;
      progress.currentTierId = tierId ?? progress.currentTierId;
      if (!progress.unlockedAt && tierId) {
        progress.unlockedAt = new Date().toISOString();
      }
    }

    res.json(progress);
  },
);

export default router;
