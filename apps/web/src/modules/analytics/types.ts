export interface TrendPoint {
  timestamp: string;
  value: number;
}

export interface FunnelStage {
  id: string;
  label: string;
  value: number;
  delta?: number;
}

export interface HeatmapCell {
  day: string;
  hour: number;
  value: number;
}

export interface EngagementSnapshot {
  activeUsers: number;
  returningUsers: number;
  averageSessionLength: number;
}
