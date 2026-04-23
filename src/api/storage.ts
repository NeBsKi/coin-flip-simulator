import type { Bet, User } from './types';
import { DEFAULT_BALANCES, HISTORY_LIMIT, STORAGE_KEYS } from '@/constants';

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  return JSON.parse(raw) as T;
}

export function readUser(): User {
  const parsed = safeParse<User>(localStorage.getItem(STORAGE_KEYS.user));
  if (parsed && parsed.balances) {
    return {
      ...parsed,
      balances: { ...DEFAULT_BALANCES, ...parsed.balances },
    };
  }
  const fresh: User = {
    balances: { ...DEFAULT_BALANCES },
  };
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(fresh));
  return fresh;
}

export function writeUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

export function readHistory(): Bet[] {
  return safeParse<Bet[]>(localStorage.getItem(STORAGE_KEYS.history)) ?? [];
}

export function writeHistory(history: Bet[]): void {
  const trimmed = history.slice(0, HISTORY_LIMIT);
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(trimmed));
}
