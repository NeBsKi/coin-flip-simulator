import type { CoinSide, Currency } from '@/api/types';

export interface AutoBetConfig {
  enabled: boolean;
  baseAmount: number;
  stopWin: number | null;
  stopLoss: number | null;
}

export interface GameState {
  currency: Currency;
  betAmount: number;
  choice: CoinSide;
  autoBet: AutoBetConfig;
  setCurrency: (currency: Currency) => void;
  setBetAmount: (amount: number) => void;
  setChoice: (choice: CoinSide) => void;
  setAutoBetEnabled: (enabled: boolean) => void;
  setAutoBetBase: (amount: number) => void;
  setStopWin: (value: number | null) => void;
  setStopLoss: (value: number | null) => void;
}
