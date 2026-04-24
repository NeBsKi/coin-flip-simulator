import type { CoinSide } from '@/api/types';

export interface ChoiceSelectorProps {
  value: CoinSide;
  onChange: (value: CoinSide) => void;
  disabled?: boolean;
}

export interface ChoiceOption {
  value: CoinSide;
  label: string;
}
