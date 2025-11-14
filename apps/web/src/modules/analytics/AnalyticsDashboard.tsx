import React from 'react';
import EngagementOverview from './EngagementOverview';
import TrendLine from './TrendLine';
import FunnelBreakdown from './FunnelBreakdown';
import Heatmap from './Heatmap';
import {
  EngagementSnapshot,
  FunnelStage,
  TrendPoint,
  HeatmapCell,
} from './types';

interface AnalyticsDashboardProps {
  snapshot: EngagementSnapshot;
  retentionTrend: TrendPoint[];
  funnel: FunnelStage[];
  concurrencyHeatmap: HeatmapCell[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  snapshot,
  retentionTrend,
  funnel,
  concurrencyHeatmap,
}) => {
  return (
    <div className="space-y-6">
      <EngagementOverview snapshot={snapshot} />
      <div className="grid gap-6 lg:grid-cols-2">
        <TrendLine title="Daily Returning Players" points={retentionTrend} />
        <FunnelBreakdown stages={funnel} />
      </div>
      <Heatmap title="Peak Concurrent Players" cells={concurrencyHeatmap} />
    </div>
  );
};

export default AnalyticsDashboard;
