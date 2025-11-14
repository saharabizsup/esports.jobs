import { RegisterXpActionInput } from './types';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

const USER_ID_PATTERN = /^[a-zA-Z0-9_-]{3,64}$/;
const TYPE_PATTERN = /^[a-zA-Z0-9_.:-]{3,64}$/;
const MAX_XP_AMOUNT = 5_000;

export interface SanitizedXpActionInput extends RegisterXpActionInput {
  metadata?: Record<string, unknown>;
}

export function sanitizeRegisterXpActionInput(
  input: RegisterXpActionInput,
): SanitizedXpActionInput {
  if (!USER_ID_PATTERN.test(input.userId)) {
    throw new ValidationError('Invalid user identifier supplied.');
  }

  if (!TYPE_PATTERN.test(input.type)) {
    throw new ValidationError('Invalid XP action type supplied.');
  }

  if (!Number.isFinite(input.amount)) {
    throw new ValidationError('XP amount must be a finite number.');
  }

  const normalizedAmount = Math.trunc(input.amount);

  if (normalizedAmount <= 0 || normalizedAmount > MAX_XP_AMOUNT) {
    throw new ValidationError('XP amount is outside of the allowed range.');
  }

  const metadata = sanitizeMetadata(input.metadata);

  return {
    ...input,
    amount: normalizedAmount,
    metadata,
  };
}

export function sanitizeMetadata(
  metadata: RegisterXpActionInput['metadata'],
): Record<string, unknown> | undefined {
  if (!metadata) return undefined;
  if (typeof metadata !== 'object') {
    throw new ValidationError('Metadata must be an object.');
  }

  return JSON.parse(JSON.stringify(metadata));
}

export function assertValidUserId(userId: string): void {
  if (!USER_ID_PATTERN.test(userId)) {
    throw new ValidationError('Invalid user identifier supplied.');
  }
}
