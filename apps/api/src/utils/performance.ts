import { performance } from 'perf_hooks';

interface PerformanceSample {
  label: string;
  durationMs: number;
  timestamp: string;
}

const samples: PerformanceSample[] = [];
const MAX_SAMPLES = 200;
const aggregates = new Map<string, { count: number; totalMs: number; maxMs: number }>();

function recordSample(sample: PerformanceSample): void {
  samples.push(sample);
  if (samples.length > MAX_SAMPLES) {
    samples.splice(0, samples.length - MAX_SAMPLES);
  }

  const current = aggregates.get(sample.label) ?? {
    count: 0,
    totalMs: 0,
    maxMs: 0,
  };
  current.count += 1;
  current.totalMs += sample.durationMs;
  current.maxMs = Math.max(current.maxMs, sample.durationMs);
  aggregates.set(sample.label, current);
}

function finalizeSample(label: string, startedAt: number): void {
  const durationMs = performance.now() - startedAt;
  recordSample({
    label,
    durationMs,
    timestamp: new Date().toISOString(),
  });

  const formatter = durationMs > 50 ? console.warn : console.debug;
  formatter?.(`[perf] ${label} completed in ${durationMs.toFixed(2)}ms`);
}

export function withPerformanceSample<T>(
  label: string,
  callback: () => T,
): T {
  const startedAt = performance.now();
  try {
    const result = callback();
    finalizeSample(label, startedAt);
    return result;
  } catch (error) {
    finalizeSample(label, startedAt);
    throw error;
  }
}

export function getPerformanceSamples(prefix?: string): PerformanceSample[] {
  if (!prefix) {
    return [...samples];
  }

  return samples.filter((sample) => sample.label.startsWith(prefix));
}

export function getPerformanceAggregates(): Record<
  string,
  { count: number; totalMs: number; maxMs: number }
> {
  return Object.fromEntries(aggregates.entries());
}

export function resetPerformanceSamples(): void {
  samples.splice(0, samples.length);
  aggregates.clear();
}
