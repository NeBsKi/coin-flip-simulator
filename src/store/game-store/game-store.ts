import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GAME_STORE_KEY, INITIAL_GAME_STATE } from './game-store.constants';
import type { GameState } from './game-store.types';

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...INITIAL_GAME_STATE,
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
      name: GAME_STORE_KEY,
    },
  ),
);
