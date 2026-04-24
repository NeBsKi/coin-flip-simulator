import type { BetStats } from '@/hooks/use-bet-history/use-bet-history.types';

export interface StatsPanelProps {
  stats: BetStats;
  loading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
}

export type StatTone = 'win' | 'loss' | 'neutral';

export interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  tone?: StatTone;
}
