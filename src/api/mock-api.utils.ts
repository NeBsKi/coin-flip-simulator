import { FAILURE_RATE, MAX_LATENCY, MIN_LATENCY } from '@/constants';
import type { CoinSide } from './types';

export function delay(): Promise<void> {
  const ms = MIN_LATENCY + Math.random() * (MAX_LATENCY - MIN_LATENCY);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function maybeFail(label: string): void {
  if (Math.random() < FAILURE_RATE) {
    throw new Error(`Network error while ${label}. Please try again.`);
  }
}

export function flip(): CoinSide {
  return Math.random() < 0.5 ? 'heads' : 'tails';
}

export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
