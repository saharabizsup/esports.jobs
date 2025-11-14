import React, { useCallback, useEffect, useMemo, useState } from 'react';

import ProgressionDashboard from './modules/progression/ProgressionDashboard';
import type { AchievementBadgeProps, QuestCardProps, StreakBadgeProps } from './modules/progression';
import { JobsBoard } from './modules/jobs';
import type { JobPosting } from './modules/jobs';
import { AuthFlow } from './modules/auth';
import type { AuthFlowCallbacks } from './modules/auth';
import { SocialHub } from './modules/social';
import { AnalyticsDashboard } from './modules/analytics';
import type {
  EngagementSnapshot,
  FunnelStage,
  HeatmapCell,
  TrendPoint,
} from './modules/analytics';
import { fetchProgressionSummary } from './api/progression';
import {
  analyticsData,
  sampleEndorsements,
  sampleJobs,
  sampleParty,
  sampleTeams,
} from './data/sampleData';

const DEMO_USER_ID = 'user-123';

interface HeroMetrics {
  quests: QuestCardProps[];
  jobs: JobPosting[];
}

type ProgressionState = {
  quests: QuestCardProps[];
  streaks: StreakBadgeProps[];
  achievements: AchievementBadgeProps[];
};

export default function App(): JSX.Element {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';

  const [progression, setProgression] = useState<ProgressionState | null>(null);
  const [progressionLoading, setProgressionLoading] = useState<boolean>(true);
  const [progressionError, setProgressionError] = useState<string | null>(null);
  const [xpTotal, setXpTotal] = useState<number | null>(null);
  const [xpError, setXpError] = useState<string | null>(null);

  const loadProgression = useCallback(async () => {
    setProgressionLoading(true);
    setProgressionError(null);
    try {
      const summary = await fetchProgressionSummary(apiBaseUrl, DEMO_USER_ID);
      setProgression(summary);
    } catch (error) {
      setProgressionError(
        error instanceof Error ? error.message : 'Unable to load progression overview.',
      );
    } finally {
      setProgressionLoading(false);
    }
  }, [apiBaseUrl]);

  const loadXpSummary = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/xp/${DEMO_USER_ID}`);
      if (!response.ok) {
        throw new Error(`XP request failed with status ${response.status}`);
      }
      const summary = (await response.json()) as { totalXp: number };
      setXpTotal(summary.totalXp);
      setXpError(null);
    } catch (error) {
      setXpError(error instanceof Error ? error.message : 'Unable to load XP summary.');
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    loadProgression();
    loadXpSummary();
  }, [loadProgression, loadXpSummary]);

  const authCallbacks = useMemo<AuthFlowCallbacks>(
    () => ({
      async onSignIn(values) {
        const response = await fetch(`${apiBaseUrl}/xp/actions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: DEMO_USER_ID,
            type: 'auth.signIn',
            amount: 250,
            metadata: { email: values.email },
          }),
        });

        if (!response.ok) {
          throw new Error('Unable to record sign-in XP.');
        }

        const summary = (await response.json()) as { totalXp: number };
        setXpTotal(summary.totalXp);
        setXpError(null);
        return { xpTotal: summary.totalXp };
      },
      async onComplete(profile) {
        const response = await fetch(`${apiBaseUrl}/xp/actions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: DEMO_USER_ID,
            type: 'auth.profileComplete',
            amount: 500,
            metadata: profile,
          }),
        });

        if (!response.ok) {
          throw new Error('Unable to award profile completion XP.');
        }

        await Promise.all([loadXpSummary(), loadProgression()]);
      },
    }),
    [apiBaseUrl, loadProgression, loadXpSummary],
  );

  const heroMetrics = useMemo<HeroMetrics>(() => {
    return {
      quests: progression?.quests ?? [],
      jobs: sampleJobs,
    };
  }, [progression]);

  return (
    <div className="app-shell">
      <section className="hero">
        <div className="hero-card">
          <h1>Bring your esports.jobs product to life locally</h1>
          <p>
            Preview progression, recruiting, and community surfaces on localhost while we stage the final FTP deployment.
          </p>

          <div className="hero-metrics">
            <span className="metric-pill">
              {xpTotal !== null ? `Current XP: ${xpTotal.toLocaleString()}` : 'Loading XP…'}
            </span>
            <span className="metric-pill">Live quests: {heroMetrics.quests.length}</span>
            <span className="metric-pill">Open roles: {heroMetrics.jobs.length}</span>
          </div>

          {xpError && <p className="error-message">{xpError}</p>}
        </div>

        <div className="hero-card">
          <AuthFlow callbacks={authCallbacks} />
        </div>
      </section>

      <section className="section">
        <header>
          <h2>Player progression</h2>
          <p>Synced with the local Express API for quests, streaks, and achievements.</p>
        </header>
        <div className="section-card">
          {progressionLoading && <p className="loading-state">Loading progression data…</p>}
          {progressionError && <p className="error-message">{progressionError}</p>}
          {!progressionLoading && !progressionError && progression && (
            <ProgressionDashboard
              quests={progression.quests}
              streaks={progression.streaks}
              achievements={progression.achievements}
            />
          )}
        </div>
      </section>

      <section className="section">
        <header>
          <h2>Esports job board</h2>
          <p>Filterable demo data showcasing the recruiting module.</p>
        </header>
        <div className="section-card">
          <JobsBoard jobs={sampleJobs} />
        </div>
      </section>

      <section className="section">
        <header>
          <h2>Community pulse</h2>
          <p>Party invites, team spotlights, and player endorsements in one hub.</p>
        </header>
        <div className="section-card">
          <SocialHub party={sampleParty} teams={sampleTeams} endorsements={sampleEndorsements} />
        </div>
      </section>

      <section className="section">
        <header>
          <h2>Live service analytics</h2>
          <p>Track returning players, funnel health, and peak concurrency.</p>
        </header>
        <div className="section-card">
          <AnalyticsDashboard
            snapshot={analyticsData.snapshot as EngagementSnapshot}
            retentionTrend={analyticsData.retentionTrend as TrendPoint[]}
            funnel={analyticsData.funnel as FunnelStage[]}
            concurrencyHeatmap={analyticsData.concurrencyHeatmap as HeatmapCell[]}
          />
        </div>
      </section>

      <footer>Local demo environment — ready to deploy to Vimexx via FTP once finalized.</footer>
    </div>
  );
}
