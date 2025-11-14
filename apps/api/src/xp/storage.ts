import fs from 'fs';
import path from 'path';

import { TtlCache } from '../utils/cache';
import { withPerformanceSample } from '../utils/performance';
import { XpLedger } from './types';

const XP_DATA_FILE = path.join(__dirname, '../../data/xp-ledger.json');
const ledgerCache = new TtlCache<'ledger', XpLedger>({ ttlMs: 60_000 });

function ensureDirectoryExists(filePath: string): void {
  const directory = path.dirname(filePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

export function loadLedger(): XpLedger {
  const cached = ledgerCache.get('ledger');
  if (cached) {
    return cached;
  }

  return withPerformanceSample('xp.storage.loadLedger', () => {
    try {
      const payload = fs.readFileSync(XP_DATA_FILE, 'utf8');
      const ledger = JSON.parse(payload) as XpLedger;
      ledgerCache.set('ledger', ledger);
      return ledger;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        const empty: XpLedger = {};
        ledgerCache.set('ledger', empty);
        return empty;
      }

      throw error;
    }
  });
}

export function saveLedger(ledger: XpLedger): void {
  withPerformanceSample('xp.storage.saveLedger', () => {
    ensureDirectoryExists(XP_DATA_FILE);
    fs.writeFileSync(XP_DATA_FILE, JSON.stringify(ledger, null, 2));
    ledgerCache.set('ledger', ledger);
  });
}

export function withLedger<T>(callback: (ledger: XpLedger) => T): T {
  const ledger = loadLedger();
  const result = callback(ledger);
  saveLedger(ledger);
  return result;
}

export function resetLedger(): void {
  withPerformanceSample('xp.storage.resetLedger', () => {
    ensureDirectoryExists(XP_DATA_FILE);
    fs.writeFileSync(XP_DATA_FILE, JSON.stringify({}, null, 2));
    ledgerCache.delete('ledger');
  });
}

export function invalidateLedgerCache(): void {
  ledgerCache.delete('ledger');
}
