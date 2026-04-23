import { useEffect } from 'react';
import { toast } from 'sonner';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components/ui';
import { useGameStore } from '@/store';
import { useUser, useBetSimulation } from '@/hooks';
import {
  BalanceDisplay,
  ChoiceSelector,
  CoinAnimation,
  AutoBetControls,
  BetActionButton,
} from '@/components/BetPanel';
import { formatCredits } from '@/lib/utils';

export function BetPanel() {
  const { data: user, isLoading, isError, error, refetch } = useUser();
  const { currency, setCurrency, betAmount, setBetAmount, choice, setChoice, autoBet } =
    useGameStore();
  const {
    placeBet,
    stopAuto,
    isSpinning,
    lastBet,
    autoSession,
    error: betError,
  } = useBetSimulation();

  const balance = user?.balances[currency];
  const manualValid = betAmount > 0 && balance !== undefined && balance >= betAmount;
  const autoValid =
    autoBet.baseAmount > 0 && balance !== undefined && balance >= autoBet.baseAmount;
  const canBet = autoBet.enabled ? autoValid : manualValid;

  useEffect(() => {
    if (!lastBet) return;

    const title =
      lastBet.outcome === 'win'
        ? `Won ${formatCredits(lastBet.amount)} ${lastBet.currency}`
        : `Lost ${formatCredits(lastBet.amount)} ${lastBet.currency}`;

    if (lastBet.outcome === 'win') {
      toast.success(title);
    } else {
      toast.error(title);
    }
  }, [lastBet]);

  useEffect(() => {
    if (!betError) return;

    const message = betError.message;

    toast.error('Bet failed', { description: message });
  }, [betError]);

  const onMaxBet = () => {
    if (balance === undefined) return;

    if (autoBet.enabled) {
      useGameStore.getState().setAutoBetBase(balance);
    } else {
      setBetAmount(balance);
    }
  };

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Failed to load account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">{(error as Error).message}</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coin flip</CardTitle>
        <CardDescription>50/50 odds. Win doubles your bet. Pick a side and flip.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border bg-card/40 p-6">
            <CoinAnimation isSpinning={isSpinning} lastBet={lastBet} choice={choice} />
          </div>

          <div className="space-y-4">
            <BalanceDisplay
              balances={user?.balances}
              active={currency}
              onSelect={setCurrency}
              disabled={isSpinning || autoSession.active}
            />

            <ChoiceSelector
              value={choice}
              onChange={setChoice}
              disabled={isSpinning || autoSession.active}
            />

            {!autoBet.enabled && (
              <div className="space-y-1.5">
                <Label htmlFor="bet-amount">Bet amount</Label>
                <div className="relative">
                  <Input
                    id="bet-amount"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value) || 0))}
                    disabled={isSpinning}
                    className="pr-16"
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <button
                      type="button"
                      onClick={onMaxBet}
                      disabled={isSpinning || balance === undefined}
                      className="rounded px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary/10 disabled:opacity-50"
                    >
                      Max
                    </button>
                  </div>
                </div>
                {isLoading ? (
                  <p className="text-xs text-muted-foreground">Loading balance…</p>
                ) : balance !== undefined ? (
                  <p className="text-xs text-muted-foreground">
                    Available: {formatCredits(balance)} {currency}
                  </p>
                ) : null}
              </div>
            )}

            <AutoBetControls session={autoSession} disabled={isSpinning && !autoSession.active} />

            <div className="flex gap-2">
              <BetActionButton
                autoBetEnabled={autoBet.enabled}
                autoSessionActive={autoSession.active}
                canBet={canBet}
                isLoading={isLoading}
                isSpinning={isSpinning}
                onPlaceBet={placeBet}
                onStopAuto={stopAuto}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
