import { DATE_FORMAT, PRECISION, TIME_FORMAT } from '@/constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCredits(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: PRECISION,
    maximumFractionDigits: PRECISION,
  });
}

export function formatSigned(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${formatCredits(Math.abs(value))}`;
}

export function formatTimestamp(ts: number): string {
  const now = Date.now();
  const sameDay = new Date(ts).toDateString() === new Date(now).toDateString();
  if (sameDay) return TIME_FORMAT.format(ts);
  return `${DATE_FORMAT.format(ts)} · ${TIME_FORMAT.format(ts)}`;
}
