import type { AutoSession } from '@/hooks/use-bet-simulation';

export const REASON_LABEL: Record<NonNullable<AutoSession['stoppedReason']>, string> = {
  stopWin: 'Stop-win reached',
  stopLoss: 'Stop-loss reached',
  insufficientBalance: 'Balance too low',
  manual: 'Stopped manually',
  error: 'Stopped on error',
};
