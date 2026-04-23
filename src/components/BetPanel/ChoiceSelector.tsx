import { clsx } from 'clsx';
import type { CoinSide } from '@/api/types';

interface ChoiceSelectorProps {
  value: CoinSide;
  onChange: (value: CoinSide) => void;
  disabled?: boolean;
}

const OPTIONS: { value: CoinSide; label: string }[] = [
  { value: 'heads', label: 'Heads' },
  { value: 'tails', label: 'Tails' },
];

export function ChoiceSelector({ value, onChange, disabled }: ChoiceSelectorProps) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Your pick
      </div>
      <div
        role="radiogroup"
        aria-label="Coin side"
        className="grid grid-cols-2 gap-2 rounded-lg border bg-card p-1"
      >
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={clsx(
              'h-9 rounded-md text-sm font-semibold transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              value === opt.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              disabled && 'cursor-not-allowed opacity-60',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
