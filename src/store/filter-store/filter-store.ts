import { create } from 'zustand';
import { INITIAL_FILTER_STATE } from './filter-store.constants';
import type { FilterState } from './filter-store.types';

export const useFilterStore = create<FilterState>((set) => ({
  ...INITIAL_FILTER_STATE,
  setOutcome: (outcome) => set({ outcome }),
  setMinAmount: (minAmount) => set({ minAmount }),
  setMaxAmount: (maxAmount) => set({ maxAmount }),
  reset: () => set({ ...INITIAL_FILTER_STATE }),
}));
