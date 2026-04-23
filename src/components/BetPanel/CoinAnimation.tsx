import { clsx } from 'clsx';
import type { Bet, CoinSide } from '@/api/types';

interface CoinAnimationProps {
  isSpinning: boolean;
  lastBet: Bet | null;
  choice: CoinSide;
}

export function CoinAnimation({ isSpinning, lastBet, choice }: CoinAnimationProps) {
  const displayFace: CoinSide = choice;
  const outcome = !isSpinning && lastBet ? lastBet.outcome : null;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={clsx(
          'relative flex h-36 w-36 items-center justify-center rounded-full transition-shadow',
          outcome === 'win' && 'shadow-lg shadow-green-500/30',
          outcome === 'loss' && 'shadow-lg shadow-destructive/30',
          !outcome && 'shadow-lg shadow-primary/20',
        )}
      >
        <div
          className={clsx(
            'flex h-full w-full items-center justify-center rounded-full border-4 text-4xl font-bold',
            'bg-gradient-to-br from-primary to-primary/60 text-primary-foreground',
            isSpinning && 'animate-flip',
            outcome === 'win' && 'border-green-500',
            outcome === 'loss' && 'border-destructive',
            !outcome && 'border-primary/60',
          )}
          aria-hidden="true"
        >
          {isSpinning ? '?' : displayFace === 'heads' ? 'H' : 'T'}
        </div>
      </div>
      <div aria-live="polite" className="h-5 text-sm">
        {isSpinning ? (
          <span className="text-muted-foreground">Flipping…</span>
        ) : lastBet ? (
          <span
            className={clsx(
              'font-semibold uppercase tracking-wider',
              lastBet.outcome === 'win' ? 'text-green-500' : 'text-destructive',
            )}
          >
            {lastBet.outcome === 'win' ? 'You won' : 'You lost'}
          </span>
        ) : (
          <span className="text-muted-foreground/70">Place a bet to flip the coin</span>
        )}
      </div>
    </div>
  );
}
