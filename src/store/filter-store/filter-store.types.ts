import type { BetOutcome } from '@/api/types';

export type OutcomeFilter = 'all' | BetOutcome;

export interface FilterState {
  outcome: OutcomeFilter;
  minAmount: number | null;
  maxAmount: number | null;
  setOutcome: (outcome: OutcomeFilter) => void;
  setMinAmount: (value: number | null) => void;
  setMaxAmount: (value: number | null) => void;
  reset: () => void;
}
