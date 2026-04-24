import type { FilterState } from './filter-store.types';

export const INITIAL_FILTER_STATE: Pick<FilterState, 'outcome' | 'minAmount' | 'maxAmount'> = {
  outcome: 'all',
  minAmount: null,
  maxAmount: null,
};
