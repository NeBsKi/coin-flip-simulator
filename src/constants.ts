import type { Currency } from '@/api/types';

// Storage keys
export const STORAGE_KEYS = {
  user: 'user',
  history: 'history',
} as const;

// Initial balance
export const INITIAL_BALANCE = 1000;

// Default balances
export const DEFAULT_BALANCES: Record<Currency, number> = {
  BTC: INITIAL_BALANCE,
  ETH: INITIAL_BALANCE,
  SOL: INITIAL_BALANCE,
};

// History limit
export const HISTORY_LIMIT = 20;

// Mock API constants
export const MIN_LATENCY = 220;
export const MAX_LATENCY = 520;
export const FAILURE_RATE = 0.02;

// Formatting constants
export const PRECISION = 2;

// Time format
export const TIME_FORMAT = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

// Date format
export const DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
});
