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
import { ValidationError, assertValidUserId } from '../xp/validation';

const router = Router();

function coerceNumber(value: unknown, fallback: number): number {
  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return numeric;
  }

  return fallback;
}

function ensurePositiveNumber(value: number, max: number): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new ValidationError('Numeric value must be zero or greater.');
  }

  return Math.min(value, max);
}

function withUserGuard(
  res: Response,
  userId: string,
  callback: () => Response | void,
): Response | void {
  try {
    assertValidUserId(userId);
    return callback();
  } catch (error) {
    const message =
      error instanceof ValidationError
        ? error.message
        : 'Invalid user identifier supplied.';
    return res.status(400).json({ message });
  }
}

router.get('/quests', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) ?? 'user-123';
  const handled = withUserGuard(res, userId, () => {
    const response: QuestLogResponse = {
      quests,
      progress: questProgress.filter((progress) => progress.userId === userId),
      streaks: streaks.filter((streak) => streak.userId === userId),
    };
    res.json(response);
  });

  if (handled) {
    return handled;
  }
});

router.post('/quests/:questId/progress', (req: Request, res: Response) => {
  const { questId } = req.params;
  const { userId, stepId, value } = req.body as {
    userId: string;
    stepId: string;
    value: number;
  };

  if (typeof stepId !== 'string' || stepId.length === 0) {
    return res.status(400).json({ message: 'Invalid step identifier provided.' });
  }

  const guardResult = withUserGuard(res, userId, () => undefined);
  if (guardResult) {
    return guardResult;
  }

  const progress = questProgress.find(
    (entry) => entry.questId === questId && entry.userId === userId,
  );

  if (!progress) {
    return res.status(404).json({ message: 'Quest progress not found.' });
  }

  const numericValue = coerceNumber(value, 0);

  let sanitizedValue: number;

  try {
    sanitizedValue = ensurePositiveNumber(numericValue, 1_000_000);
    progress.stepProgress[stepId] = sanitizedValue;
  } catch (error) {
    return res
      .status(400)
      .json({ message: (error as Error).message ?? 'Invalid step progress.' });
  }
  const target = quests
    .find((quest) => quest.id === questId)
    ?.steps.find((step) => step.id === stepId)?.target ?? Infinity;

  if (sanitizedValue >= target) {
    if (!progress.completedStepIds.includes(stepId)) {
      progress.completedStepIds.push(stepId);
    }
  }

  res.json(progress);
});

router.get('/achievements', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) ?? 'user-123';
  const handled = withUserGuard(res, userId, () => {
    const response: AchievementResponse = {
      achievements,
      progress: achievementProgress.filter(
        (progress) => progress.userId === userId,
      ),
    };
    res.json(response);
  });

  if (handled) {
    return handled;
  }
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

    const guardResult = withUserGuard(res, userId, () => undefined);
    if (guardResult) {
      return guardResult;
    }

    let progress = achievementProgress.find(
      (entry) => entry.achievementId === achievementId && entry.userId === userId,
    );

    try {
      if (!progress) {
        progress = {
          achievementId,
          userId,
          points: ensurePositiveNumber(coerceNumber(points, 0), 1_000_000),
          currentTierId: tierId,
        } as AchievementProgress;
        achievementProgress.push(progress);
      } else {
        progress.points = ensurePositiveNumber(
          coerceNumber(points, progress.points ?? 0),
          1_000_000,
        );
        progress.currentTierId = tierId ?? progress.currentTierId;
        if (!progress.unlockedAt && tierId) {
          progress.unlockedAt = new Date().toISOString();
        }
      }
    } catch (error) {
      const message =
        error instanceof ValidationError
          ? error.message
          : (error as Error).message ?? 'Invalid achievement update.';
      return res.status(400).json({ message });
    }

    res.json(progress);
  },
);

export default router;
