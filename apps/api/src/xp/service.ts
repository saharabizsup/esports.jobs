import { randomUUID } from 'crypto';

import { TtlCache } from '../utils/cache';
import { withPerformanceSample } from '../utils/performance';
import { loadLedger, saveLedger } from './storage';
import { RegisterXpActionInput, XpAction, XpLedger } from './types';
import {
  assertValidUserId,
  sanitizeRegisterXpActionInput,
  SanitizedXpActionInput,
} from './validation';

export interface XpSummary {
  userId: string;
  totalXp: number;
  actions: XpAction[];
}

const summaryCache = new TtlCache<string, XpSummary>({ ttlMs: 15_000, clone: true });

function getUserLedger(ledger: XpLedger, userId: string) {
  if (!ledger[userId]) {
    ledger[userId] = { totalXp: 0, actions: [] };
  }

  return ledger[userId];
}

function recordAction(
  entry: XpLedger[keyof XpLedger],
  input: SanitizedXpActionInput,
): XpAction {
  const action: XpAction = {
    id: randomUUID(),
    userId: input.userId,
    type: input.type,
    amount: input.amount,
    timestamp: new Date().toISOString(),
    metadata: input.metadata,
  };

  entry.totalXp += input.amount;
  entry.actions.unshift(action);
  entry.actions = entry.actions.slice(0, 50);

  return action;
}

export function registerXpAction(input: RegisterXpActionInput): XpSummary {
  return withPerformanceSample('xp.service.registerXpAction', () => {
    const sanitized = sanitizeRegisterXpActionInput(input);
    const ledger = loadLedger();
    const entry = getUserLedger(ledger, sanitized.userId);
    recordAction(entry, sanitized);

    saveLedger(ledger);

    const summary = {
      userId: sanitized.userId,
      totalXp: entry.totalXp,
      actions: entry.actions,
    };

    summaryCache.set(sanitized.userId, summary);

    return summary;
  });
}

export function getXpSummary(userId: string): XpSummary {
  assertValidUserId(userId);

  const cached = summaryCache.get(userId);
  if (cached) {
    return cached;
  }

  return withPerformanceSample('xp.service.getXpSummary', () => {
    const ledger = loadLedger();
    const entry = getUserLedger(ledger, userId);

    const summary = {
      userId,
      totalXp: entry.totalXp,
      actions: entry.actions,
    };

    summaryCache.set(userId, summary);

    return summary;
  });
}

export function grantXpToMultiple(users: RegisterXpActionInput[]): XpSummary[] {
  return withPerformanceSample('xp.service.grantXpToMultiple', () => {
    const ledger = loadLedger();
    const summaries: XpSummary[] = [];

    for (const rawInput of users) {
      const input = sanitizeRegisterXpActionInput(rawInput);
      const entry = getUserLedger(ledger, input.userId);
      recordAction(entry, input);

      const summary = {
        userId: input.userId,
        totalXp: entry.totalXp,
        actions: entry.actions,
      };

      summaries.push(summary);
      summaryCache.set(input.userId, summary);
    }

    saveLedger(ledger);

    return summaries;
  });
}

export function rollbackXpAction(userId: string, actionId: string): XpSummary {
  assertValidUserId(userId);

  return withPerformanceSample('xp.service.rollbackXpAction', () => {
    const ledger = loadLedger();
    const entry = getUserLedger(ledger, userId);
    const index = entry.actions.findIndex((action) => action.id === actionId);

    if (index === -1) {
      return {
        userId,
        totalXp: entry.totalXp,
        actions: entry.actions,
      };
    }

    const [removed] = entry.actions.splice(index, 1);
    entry.totalXp -= removed.amount;

    saveLedger(ledger);

    const summary = {
      userId,
      totalXp: entry.totalXp,
      actions: entry.actions,
    };

    summaryCache.set(userId, summary);

    return summary;
  });
}

export function resetSummaryCache(): void {
  summaryCache.clear();
}
