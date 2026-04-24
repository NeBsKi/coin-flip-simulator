import type { BetStats } from './use-bet-history.types';

export const EMPTY_STATS: BetStats = {
  totalBets: 0,
  wins: 0,
  losses: 0,
  winRatio: 0,
  biggestWin: 0,
  biggestLoss: 0,
  netProfit: 0,
};
