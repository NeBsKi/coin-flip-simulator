import type { GameState } from './game-store.types';

export const INITIAL_GAME_STATE: Pick<GameState, 'currency' | 'betAmount' | 'choice' | 'autoBet'> =
  {
    currency: 'BTC',
    betAmount: 10,
    choice: 'heads',
    autoBet: {
      enabled: false,
      baseAmount: 10,
      stopWin: 200,
      stopLoss: 200,
    },
  };

export const GAME_STORE_KEY = 'settings';
