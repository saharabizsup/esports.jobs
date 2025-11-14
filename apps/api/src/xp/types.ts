export interface XpAction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface XpLedgerEntry {
  totalXp: number;
  actions: XpAction[];
}

export type XpLedger = Record<string, XpLedgerEntry>;

export interface RegisterXpActionInput {
  userId: string;
  type: string;
  amount: number;
  metadata?: Record<string, unknown>;
}
