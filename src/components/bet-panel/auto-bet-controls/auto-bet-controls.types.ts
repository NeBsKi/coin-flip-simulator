import type { AutoSession } from '@/hooks/use-bet-simulation';

export interface AutoBetControlsProps {
  session: AutoSession;
  disabled?: boolean;
}

export interface AmountFieldProps {
  id: string;
  label: string;
  currency: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export interface NullableAmountFieldProps {
  id: string;
  label: string;
  currency: string;
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
}

export type SessionStatTone = 'win' | 'loss' | 'neutral';

export interface SessionStatProps {
  label: string;
  value: string;
  tone?: SessionStatTone;
}
