import { randomUUID } from 'crypto';

import { loadLedger, saveLedger } from './storage';
import { RegisterXpActionInput, XpAction, XpLedger } from './types';

export interface XpSummary {
  userId: string;
  totalXp: number;
  actions: XpAction[];
}

function getUserLedger(ledger: XpLedger, userId: string) {
  if (!ledger[userId]) {
    ledger[userId] = { totalXp: 0, actions: [] };
  }

  return ledger[userId];
}

export function registerXpAction(input: RegisterXpActionInput): XpSummary {
  const ledger = loadLedger();
  const entry = getUserLedger(ledger, input.userId);
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

  saveLedger(ledger);

  return {
    userId: input.userId,
    totalXp: entry.totalXp,
    actions: entry.actions,
  };
}

export function getXpSummary(userId: string): XpSummary {
  const ledger = loadLedger();
  const entry = getUserLedger(ledger, userId);

  return {
    userId,
    totalXp: entry.totalXp,
    actions: entry.actions,
  };
}

export function grantXpToMultiple(users: RegisterXpActionInput[]): XpSummary[] {
  const ledger = loadLedger();
  const summaries: XpSummary[] = [];

  for (const input of users) {
    const entry = getUserLedger(ledger, input.userId);
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

    summaries.push({
      userId: input.userId,
      totalXp: entry.totalXp,
      actions: entry.actions,
    });
  }

  saveLedger(ledger);

  return summaries;
}

export function rollbackXpAction(userId: string, actionId: string): XpSummary {
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

  return {
    userId,
    totalXp: entry.totalXp,
    actions: entry.actions,
  };
}
