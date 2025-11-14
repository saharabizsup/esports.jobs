import fs from 'fs';
import path from 'path';

import { XpLedger } from './types';

const XP_DATA_FILE = path.join(__dirname, '../../data/xp-ledger.json');

function ensureDirectoryExists(filePath: string): void {
  const directory = path.dirname(filePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

export function loadLedger(): XpLedger {
  try {
    const payload = fs.readFileSync(XP_DATA_FILE, 'utf8');
    return JSON.parse(payload) as XpLedger;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {};
    }

    throw error;
  }
}

export function saveLedger(ledger: XpLedger): void {
  ensureDirectoryExists(XP_DATA_FILE);
  fs.writeFileSync(XP_DATA_FILE, JSON.stringify(ledger, null, 2));
}

export function withLedger<T>(callback: (ledger: XpLedger) => T): T {
  const ledger = loadLedger();
  const result = callback(ledger);
  saveLedger(ledger);
  return result;
}

export function resetLedger(): void {
  ensureDirectoryExists(XP_DATA_FILE);
  fs.writeFileSync(XP_DATA_FILE, JSON.stringify({}, null, 2));
}
