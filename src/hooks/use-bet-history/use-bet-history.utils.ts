import type { Bet } from '@/api/types';
import { EMPTY_STATS } from './use-bet-history.constants';
import type { BetStats } from './use-bet-history.types';

export function computeStats(bets: Bet[]): BetStats {
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
