export type Currency = 'BTC' | 'ETH' | 'SOL';

export const CURRENCIES: Currency[] = ['BTC', 'ETH', 'SOL'];

export type CoinSide = 'heads' | 'tails';

export type BetOutcome = 'win' | 'loss';

export interface FlipResult {
  result: CoinSide;
}

export interface User {
  balances: Record<Currency, number>;
}

export interface Bet {
  id: string;
  currency: Currency;
  amount: number;
  outcome: BetOutcome;
  balanceAfter?: number;
  timestamp: number;
}

export interface PlaceBetInput {
  currency: Currency;
  amount: number;
  choice: CoinSide;
}
