export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export interface ModerationJobPosting {
  id: string;
  title: string;
  org: string;
  submittedBy: string;
  submittedAt: string;
  status: ModerationStatus;
  notes?: string;
  tags: string[];
}

export interface ModerationAction {
  moderator: string;
  decision: Exclude<ModerationStatus, 'pending'>;
  notes?: string;
}
