import { clsx } from 'clsx';
import { Input, Label, Switch } from '@/components/ui';
import { useGameStore } from '@/store';
import type { AutoSession } from '@/hooks/useBetSimulation';
import { formatSigned } from '@/lib/utils';

interface AutoBetControlsProps {
  session: AutoSession;
  disabled?: boolean;
}

function numberOrNull(raw: string): number | null {
  if (raw.trim() === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function AutoBetControls({ session, disabled }: AutoBetControlsProps) {
  const { autoBet, setAutoBetEnabled, setAutoBetBase, setStopWin, setStopLoss, currency } =
    useGameStore();

  const inputsDisabled = disabled || session.active;

  return (
    <div className="space-y-4 rounded-xl border bg-card/50 p-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Switch
            id="auto-bet"
            checked={autoBet.enabled}
            onCheckedChange={setAutoBetEnabled}
            disabled={disabled}
          />
          <Label htmlFor="auto-bet">Martingale auto-bet</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Doubles the bet after every loss, resets after every win.
        </p>
      </div>

      {autoBet.enabled && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <AmountField
              id="auto-base"
              label="Base bet"
              currency={currency}
              value={autoBet.baseAmount}
              onChange={(v) => setAutoBetBase(Math.max(0, v))}
              disabled={inputsDisabled}
            />
            <NullableAmountField
              id="auto-stop-win"
              label="Stop win"
              currency={currency}
              value={autoBet.stopWin}
              onChange={setStopWin}
              disabled={inputsDisabled}
            />
            <NullableAmountField
              id="auto-stop-loss"
              label="Stop loss"
              currency={currency}
              value={autoBet.stopLoss}
              onChange={setStopLoss}
              disabled={inputsDisabled}
            />
          </div>

          {(session.active || session.runs > 0) && <SessionSummary session={session} />}
        </>
      )}
    </div>
  );
}

function AmountField({
  id,
  label,
  currency,
  value,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  currency: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          disabled={disabled}
          className="pr-12"
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
          {currency}
        </span>
      </div>
    </div>
  );
}

function NullableAmountField({
  id,
  label,
  currency,
  value,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  currency: string;
  value: number | null;
  onChange: (v: number | null) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          placeholder="None"
          value={value ?? ''}
          onChange={(e) => onChange(numberOrNull(e.target.value))}
          disabled={disabled}
          className="pr-12"
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
          {currency}
        </span>
      </div>
    </div>
  );
}

function SessionSummary({ session }: { session: AutoSession }) {
  const reasonLabel: Record<NonNullable<AutoSession['stoppedReason']>, string> = {
    stopWin: 'Stop-win reached',
    stopLoss: 'Stop-loss reached',
    insufficientBalance: 'Balance too low',
    manual: 'Stopped manually',
    error: 'Stopped on error',
  };

  return (
    <div className="grid grid-cols-3 gap-3 rounded-lg border bg-background/60 p-3 text-center">
      <SessionStat label="Runs" value={session.runs.toString()} />
      <SessionStat
        label="Session P/L"
        value={formatSigned(session.profit)}
        tone={session.profit > 0 ? 'win' : session.profit < 0 ? 'loss' : 'neutral'}
      />
      <SessionStat
        label={session.active ? 'Next bet' : 'Status'}
        value={
          session.active
            ? session.currentBet.toString()
            : session.stoppedReason
              ? reasonLabel[session.stoppedReason]
              : 'Idle'
        }
      />
    </div>
  );
}

function SessionStat({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: 'win' | 'loss' | 'neutral';
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70">{label}</div>
      <div
        className={clsx(
          'mt-1 font-mono text-sm font-semibold',
          tone === 'win' && 'text-green-500',
          tone === 'loss' && 'text-destructive',
          tone === 'neutral' && 'text-foreground',
        )}
      >
        {value}
      </div>
    </div>
  );
}
