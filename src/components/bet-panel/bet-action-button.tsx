import { Button } from '@/components/ui';

interface BetActionButtonProps {
  autoBetEnabled: boolean;
  autoSessionActive: boolean;
  canBet: boolean;
  isLoading: boolean;
  isSpinning: boolean;
  onPlaceBet: () => void;
  onStopAuto: () => void;
}

export function BetActionButton({
  autoBetEnabled,
  autoSessionActive,
  canBet,
  isLoading,
  isSpinning,
  onPlaceBet,
  onStopAuto,
}: BetActionButtonProps) {
  let label = 'Flip coin';

  if (autoSessionActive) {
    label = 'Stop auto-bet';
  } else if (autoBetEnabled) {
    label = 'Start auto-bet';
  } else if (isSpinning) {
    label = 'Flipping…';
  }

  return (
    <Button
      variant={autoSessionActive ? 'destructive' : 'default'}
      size="lg"
      className="w-full"
      disabled={isLoading || (!autoSessionActive && !canBet)}
      onClick={autoSessionActive ? onStopAuto : onPlaceBet}
    >
      {label}
    </Button>
  );
}
