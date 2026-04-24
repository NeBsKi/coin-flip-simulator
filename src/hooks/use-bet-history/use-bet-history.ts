import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getHistory } from '@/api/mock-api';
import { queryKeys } from '@/lib/query-client';
import { useFilterStore } from '@/store';
import { useDebounce } from '@/hooks';
import type { Bet } from '@/api/types';
import { computeStats } from './use-bet-history.utils';

export function useBetHistory() {
  const query = useQuery<Bet[], Error>({
    queryKey: queryKeys.history,
    queryFn: getHistory,
  });

  const { outcome, minAmount, maxAmount } = useFilterStore();
  const debouncedMin = useDebounce(minAmount, 250);
  const debouncedMax = useDebounce(maxAmount, 250);

  const bets = useMemo(() => query.data ?? [], [query.data]);

  const filteredBets = useMemo(() => {
    return bets.filter((bet) => {
      if (outcome !== 'all' && bet.outcome !== outcome) return false;
      if (debouncedMin != null && bet.amount < debouncedMin) return false;
      if (debouncedMax != null && bet.amount > debouncedMax) return false;
      return true;
    });
  }, [bets, outcome, debouncedMin, debouncedMax]);

  const allStats = useMemo(() => computeStats(bets), [bets]);
  const filteredStats = useMemo(() => computeStats(filteredBets), [filteredBets]);

  return {
    ...query,
    bets,
    filteredBets,
    allStats,
    filteredStats,
  };
}
