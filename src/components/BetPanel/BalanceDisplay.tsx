import { clsx } from 'clsx';
import { CURRENCIES, type Currency } from '@/api/types';
import { formatCredits } from '@/lib/utils';

interface BalanceDisplayProps {
  balances: Record<Currency, number> | undefined;
  active: Currency;
  onSelect: (currency: Currency) => void;
  disabled?: boolean;
}

export function BalanceDisplay({ balances, active, onSelect, disabled }: BalanceDisplayProps) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Currency
      </div>
      <div className="grid grid-cols-3 gap-2">
        {CURRENCIES.map((currency) => {
          const isActive = active === currency;
          const balance = balances?.[currency];
          return (
            <button
              key={currency}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(currency)}
              className={clsx(
                'flex flex-col items-start rounded-lg border px-3 py-2.5 text-left transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-input hover:bg-muted/60',
                disabled && 'cursor-not-allowed opacity-60',
              )}
            >
              <span
                className={clsx(
                  'text-xs font-semibold uppercase tracking-wider',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {currency}
              </span>
              <span className="mt-0.5 font-mono text-sm text-foreground">
                {balance !== undefined ? formatCredits(balance) : '—'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
