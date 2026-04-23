import { create } from 'zustand';
import type { BetOutcome } from '@/api/types';

export type OutcomeFilter = 'all' | BetOutcome;

interface FilterState {
  outcome: OutcomeFilter;
  minAmount: number | null;
  maxAmount: number | null;
  setOutcome: (outcome: OutcomeFilter) => void;
  setMinAmount: (value: number | null) => void;
  setMaxAmount: (value: number | null) => void;
  reset: () => void;
}

const INITIAL: Pick<FilterState, 'outcome' | 'minAmount' | 'maxAmount'> = {
  outcome: 'all',
  minAmount: null,
  maxAmount: null,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...INITIAL,
  setOutcome: (outcome) => set({ outcome }),
  setMinAmount: (minAmount) => set({ minAmount }),
  setMaxAmount: (maxAmount) => set({ maxAmount }),
  reset: () => set({ ...INITIAL }),
}));
