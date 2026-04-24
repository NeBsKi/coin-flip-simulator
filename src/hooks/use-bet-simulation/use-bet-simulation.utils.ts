import { HISTORY_LIMIT } from '@/constants';
import type { Bet } from '@/api/types';
import type { AutoBetConfig } from '@/store/game-store';
import type { AutoSession, StopReason } from './use-bet-simulation.types';

export function createActiveSession(initialAmount: number): AutoSession {
  return {
    active: true,
    runs: 0,
    profit: 0,
    currentBet: initialAmount,
    stoppedReason: null,
  };
}

export function stopSession(session: AutoSession, stoppedReason: StopReason): AutoSession {
  return {
    ...session,
    active: false,
    stoppedReason,
  };
}

export function trimHistory(history: Bet[]) {
  return history.slice(0, HISTORY_LIMIT);
}

export function getNextAutoSession(currentSession: AutoSession, config: AutoBetConfig, bet: Bet) {
  const delta = bet.outcome === 'win' ? bet.amount : -bet.amount;
  const nextProfit = currentSession.profit + delta;
  const nextBetAmount = bet.outcome === 'loss' ? bet.amount * 2 : config.baseAmount;

  let stoppedReason: StopReason | null = null;

  if (config.stopWin != null && nextProfit >= config.stopWin) {
    stoppedReason = 'stopWin';
  } else if (config.stopLoss != null && nextProfit <= -config.stopLoss) {
    stoppedReason = 'stopLoss';
  } else if (bet.balanceAfter != null && bet.balanceAfter < nextBetAmount) {
    stoppedReason = 'insufficientBalance';
  }

  return {
    stoppedReason,
    nextSession: {
      active: stoppedReason == null,
      runs: currentSession.runs + 1,
      profit: nextProfit,
      currentBet: nextBetAmount,
      stoppedReason,
    } satisfies AutoSession,
  };
}
