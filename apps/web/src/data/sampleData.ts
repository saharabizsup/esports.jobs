import type { JobPosting } from '../modules/jobs';
import type { Endorsement, PartyMember, TeamSummary } from '../modules/social';
import type {
  EngagementSnapshot,
  FunnelStage,
  HeatmapCell,
  TrendPoint,
} from '../modules/analytics';

export const sampleJobs: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Head Coach - Valorant',
    org: 'Aurora Nova',
    location: 'Berlin, Germany',
    commitment: 'full-time',
    description:
      'Design practice blocks, review VODs with the analyst team, and build player development roadmaps for our franchise roster.',
    tags: ['coaching', 'valorant', 'leadership'],
    publishedAt: '2024-04-29T00:00:00.000Z',
  },
  {
    id: 'job-2',
    title: 'Broadcast Producer',
    org: 'United Esports League',
    location: 'Remote - North America',
    commitment: 'contract',
    description:
      'Own the live show rundown, manage comms between observers and casters, and deliver world-class remote broadcasts.',
    tags: ['production', 'broadcast', 'remote'],
    publishedAt: '2024-04-26T00:00:00.000Z',
  },
  {
    id: 'job-3',
    title: 'Partnerships Manager',
    org: 'Hyperwave Studios',
    location: 'Los Angeles, USA',
    commitment: 'full-time',
    description:
      'Scale endemic sponsorships, track partner KPIs, and collaborate with marketing to craft community-first activations.',
    tags: ['business development', 'marketing'],
    publishedAt: '2024-04-20T00:00:00.000Z',
  },
  {
    id: 'job-4',
    title: 'Esports Data Analyst',
    org: 'Nexus Competitive',
    location: 'Singapore',
    commitment: 'full-time',
    description:
      'Model player tendencies, surface draft efficiencies, and support the coaching staff with scenario planning dashboards.',
    tags: ['analytics', 'data science'],
    publishedAt: '2024-04-18T00:00:00.000Z',
  },
];

const partyMembers: PartyMember[] = [
  { id: 'member-1', handle: 'NovaLynx', role: 'IGL', status: 'online' },
  { id: 'member-2', handle: 'Orbit', role: 'Controller', status: 'online' },
  { id: 'member-3', handle: 'Mythic', role: 'Duelist', status: 'inMatch' },
  { id: 'member-4', handle: 'Quell', role: 'Initiator', status: 'offline' },
];

export const sampleParty = {
  name: 'Patch Day Scrim Squad',
  invitesOpen: true,
  members: partyMembers,
};

export const sampleTeams: TeamSummary[] = [
  {
    id: 'team-1',
    name: 'Nebula Legends',
    rank: 'International Contenders',
    members: partyMembers.slice(0, 3),
  },
  {
    id: 'team-2',
    name: 'Nightfall Collective',
    rank: 'Top 16 Regional',
    members: [
      { id: 'member-5', handle: 'Echo', role: 'Support', status: 'online' },
      { id: 'member-6', handle: 'Tempest', role: 'Carry', status: 'online' },
      { id: 'member-7', handle: 'Sable', role: 'Flex', status: 'offline' },
    ],
  },
];

export const sampleEndorsements: Endorsement[] = [
  {
    id: 'endorsement-1',
    from: 'CoachPax',
    to: 'NovaLynx',
    category: 'strategist',
    message: 'Consistently preps counter-strats that catch opponents off guard.',
    createdAt: '2024-04-30T12:00:00.000Z',
  },
  {
    id: 'endorsement-2',
    from: 'Orbit',
    to: 'Mythic',
    category: 'leader',
    message: 'Turns chaotic mid-rounds into coordinated retakes.',
    createdAt: '2024-04-29T18:30:00.000Z',
  },
  {
    id: 'endorsement-3',
    from: 'AnalystDuo',
    to: 'Quell',
    category: 'teamwork',
    message: 'Always shares scouting packets before scrims start.',
    createdAt: '2024-04-28T09:15:00.000Z',
  },
];

export const analyticsSnapshot: EngagementSnapshot = {
  activeUsers: 48632,
  returningUsers: 21344,
  averageSessionLength: 42.5,
};

export const retentionTrend: TrendPoint[] = Array.from({ length: 7 }).map((_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - index));
  return {
    timestamp: date.toISOString(),
    value: 18000 + index * 1200 + (index % 2 === 0 ? 600 : 0),
  };
});

export const funnelStages: FunnelStage[] = [
  { id: 'stage-1', label: 'Landing Page Visitors', value: 120000 },
  { id: 'stage-2', label: 'Account Created', value: 32500, delta: 8 },
  { id: 'stage-3', label: 'Completed Onboarding', value: 22600, delta: 5 },
  { id: 'stage-4', label: 'Applied to a Role', value: 9400, delta: 12 },
];

export const concurrencyHeatmap: HeatmapCell[] = Array.from({ length: 7 * 6 }).map((_, index) => {
  const dayIndex = Math.floor(index / 6);
  const hourBlock = (index % 6) * 4;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const base = 950 + dayIndex * 120;
  const variation = 100 + (hourBlock > 12 && hourBlock < 24 ? 340 : 0);
  return {
    day: days[dayIndex],
    hour: hourBlock,
    value: base + variation + Math.round(Math.random() * 80),
  };
});

export const analyticsData = {
  snapshot: analyticsSnapshot,
  retentionTrend,
  funnel: funnelStages,
  concurrencyHeatmap,
};
