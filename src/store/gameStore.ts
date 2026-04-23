import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CoinSide, Currency } from '@/api/types';

export interface AutoBetConfig {
  enabled: boolean;
  baseAmount: number;
  stopWin: number | null;
  stopLoss: number | null;
}

interface GameState {
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

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      currency: 'BTC',
      betAmount: 10,
      choice: 'heads',
      autoBet: {
        enabled: false,
        baseAmount: 10,
        stopWin: 200,
        stopLoss: 200,
      },
      setCurrency: (currency) => set({ currency }),
      setBetAmount: (betAmount) => set({ betAmount }),
      setChoice: (choice) => set({ choice }),
      setAutoBetEnabled: (enabled) => set((state) => ({ autoBet: { ...state.autoBet, enabled } })),
      setAutoBetBase: (baseAmount) =>
        set((state) => ({ autoBet: { ...state.autoBet, baseAmount } })),
      setStopWin: (stopWin) => set((state) => ({ autoBet: { ...state.autoBet, stopWin } })),
      setStopLoss: (stopLoss) => set((state) => ({ autoBet: { ...state.autoBet, stopLoss } })),
    }),
    {
      name: 'settings',
    },
  ),
);
