import type { Bet, PlaceBetInput, User } from './types';
import { readHistory, readUser, writeHistory, writeUser } from './storage';
import { createId, delay, flip, maybeFail } from './mock-api.utils';

export async function getUser(): Promise<User> {
  await delay();
  maybeFail('fetching user');
  return readUser();
}

export async function getHistory(): Promise<Bet[]> {
  await delay();
  maybeFail('fetching history');
  return readHistory();
}

export async function placeBet(input: PlaceBetInput): Promise<Bet> {
  await delay();
  maybeFail('placing bet');

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error('Bet amount must be greater than zero.');
  }

  const user = readUser();
  const balance = user.balances[input.currency];

  if (balance < input.amount) {
    throw new Error(`Insufficient ${input.currency} balance.`);
  }

  const result = flip();
  const outcome = result === input.choice ? 'win' : 'loss';
  const payout = outcome === 'win' ? input.amount * 2 : 0;
  const balanceAfter = balance - input.amount + payout;

  const nextUser: User = {
    ...user,
    balances: {
      ...user.balances,
      [input.currency]: balanceAfter,
    },
  };
  writeUser(nextUser);

  const bet: Bet = {
    id: createId(),
    currency: input.currency,
    amount: input.amount,
    outcome,
    balanceAfter,
    timestamp: Date.now(),
  };

  const history = readHistory();
  writeHistory([bet, ...history]);

  return bet;
}
