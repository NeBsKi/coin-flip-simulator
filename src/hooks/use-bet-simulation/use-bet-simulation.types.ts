import type { Bet } from '@/api/types';

export type StopReason = 'stopWin' | 'stopLoss' | 'insufficientBalance' | 'manual' | 'error';

export interface AutoSession {
  active: boolean;
  runs: number;
  profit: number;
  currentBet: number;
  stoppedReason: StopReason | null;
}

export interface UseBetSimulationResult {
  placeBet: () => void;
  stopAuto: () => void;
  isSpinning: boolean;
  lastBet: Bet | null;
  error: Error | null;
  autoSession: AutoSession;
}
