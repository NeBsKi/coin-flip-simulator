import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getHistory } from '@/api/mockApi';
import { queryKeys } from '@/lib/queryClient';
import { useFilterStore } from '@/store';
import { useDebounce } from '@/hooks';
import type { Bet } from '@/api/types';

export interface BetStats {
  totalBets: number;
  wins: number;
  losses: number;
  winRatio: number;
  biggestWin: number;
  biggestLoss: number;
  netProfit: number;
}

const EMPTY_STATS: BetStats = {
  totalBets: 0,
  wins: 0,
  losses: 0,
  winRatio: 0,
  biggestWin: 0,
  biggestLoss: 0,
  netProfit: 0,
};

function computeStats(bets: Bet[]): BetStats {
  if (bets.length === 0) return EMPTY_STATS;
  let wins = 0;
  let losses = 0;
  let biggestWin = 0;
  let biggestLoss = 0;
  let netProfit = 0;

  for (const bet of bets) {
    const profit = bet.outcome === 'win' ? bet.amount : -bet.amount;
    netProfit += profit;
    if (bet.outcome === 'win') {
      wins += 1;
      if (profit > biggestWin) biggestWin = profit;
    } else {
      losses += 1;
      if (-profit > biggestLoss) biggestLoss = -profit;
    }
  }

  return {
    totalBets: bets.length,
    wins,
    losses,
    winRatio: wins / bets.length,
    biggestWin,
    biggestLoss,
    netProfit,
  };
}

export function useBetHistory() {
  const query = useQuery<Bet[]>({
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
