import type { AutoSession } from './use-bet-simulation.types';

export const INITIAL_SESSION: AutoSession = {
  active: false,
  runs: 0,
  profit: 0,
  currentBet: 0,
  stoppedReason: null,
};
