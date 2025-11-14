export interface PartyMember {
  id: string;
  handle: string;
  role: string;
  status: 'online' | 'inMatch' | 'offline';
}

export interface TeamSummary {
  id: string;
  name: string;
  rank: string;
  members: PartyMember[];
}

export interface Endorsement {
  id: string;
  from: string;
  to: string;
  category: 'teamwork' | 'shotcaller' | 'leader' | 'strategist';
  message?: string;
  createdAt: string;
}
