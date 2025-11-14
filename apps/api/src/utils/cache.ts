export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

interface CacheOptions {
  ttlMs: number;
  clone?: boolean;
}

export class TtlCache<Key extends string, Value> {
  private entries = new Map<Key, CacheEntry<Value>>();

  constructor(private readonly options: CacheOptions) {}

  get(key: Key): Value | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;

    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return undefined;
    }

    if (!this.options.clone) {
      return entry.value;
    }

    return JSON.parse(JSON.stringify(entry.value)) as Value;
  }

  set(key: Key, value: Value): void {
    const expiresAt = Date.now() + this.options.ttlMs;
    this.entries.set(key, { value, expiresAt });
  }

  delete(key: Key): void {
    this.entries.delete(key);
  }

  clear(): void {
    this.entries.clear();
  }
}
