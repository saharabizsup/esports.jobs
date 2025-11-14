import { Request, Response, Router } from 'express';

import {
  getXpSummary,
  grantXpToMultiple,
  registerXpAction,
  rollbackXpAction,
} from './service';
import { ValidationError, assertValidUserId } from './validation';

const router = Router();

router.get('/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    assertValidUserId(userId);
    const summary = getXpSummary(userId);
    res.json(summary);
  } catch (error) {
    const message = error instanceof ValidationError ? error.message : 'Unable to load XP summary.';
    res.status(400).json({ message });
  }
});

router.post('/actions', (req: Request, res: Response) => {
  try {
    const summary = registerXpAction(req.body);
    res.json(summary);
  } catch (error) {
    const status = error instanceof ValidationError ? 400 : 500;
    const message =
      error instanceof ValidationError ? error.message : (error as Error).message ?? 'Unable to record XP action.';
    res.status(status).json({ message });
  }
});

router.post('/actions/batch', (req: Request, res: Response) => {
  try {
    const summaries = grantXpToMultiple(Array.isArray(req.body) ? req.body : []);
    res.json(summaries);
  } catch (error) {
    const status = error instanceof ValidationError ? 400 : 500;
    const message =
      error instanceof ValidationError ? error.message : (error as Error).message ?? 'Unable to process batch grant.';
    res.status(status).json({ message });
  }
});

router.delete('/:userId/actions/:actionId', (req: Request, res: Response) => {
  const { userId, actionId } = req.params;

  try {
    assertValidUserId(userId);
    const summary = rollbackXpAction(userId, actionId);
    res.json(summary);
  } catch (error) {
    const status = error instanceof ValidationError ? 400 : 500;
    const message =
      error instanceof ValidationError
        ? error.message
        : (error as Error).message ?? 'Unable to rollback XP action.';
    res.status(status).json({ message });
  }
});

export default router;
