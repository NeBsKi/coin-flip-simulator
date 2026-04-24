import { clsx } from 'clsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  SectionErrorState,
} from '@/components/ui';
import { HISTORY_LIMIT } from '@/constants';
import { formatCredits, formatSigned } from '@/lib/utils';
import type { StatCardProps, StatsPanelProps } from './stats-panel.types';

export function StatsPanel({ stats, loading, errorMessage, onRetry }: StatsPanelProps) {
  const winPct = stats.totalBets === 0 ? 0 : Math.round(stats.winRatio * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
        <CardDescription>Computed from your last {HISTORY_LIMIT} bets.</CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage ? (
          <SectionErrorState message={errorMessage} onAction={onRetry} actionLabel="Retry" />
        ) : loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-xl border bg-card/60 motion-safe:animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Total bets" value={stats.totalBets.toString()} />
            <StatCard
              label="Win / Loss"
              value={`${stats.wins} / ${stats.losses}`}
              sub={`${winPct}% win rate`}
            />
            <StatCard
              label="Net P/L"
              value={formatSigned(stats.netProfit)}
              tone={stats.netProfit > 0 ? 'win' : stats.netProfit < 0 ? 'loss' : 'neutral'}
            />
            <StatCard
              label="Biggest win / loss"
              value={`${formatCredits(stats.biggestWin)} / ${formatCredits(stats.biggestLoss)}`}
            />
          </div>
        )}

        {stats.totalBets > 0 && (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Win rate</span>
              <span className="font-mono">{winPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-success to-primary transition-all"
                style={{ width: `${winPct}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatCard({ label, value, sub, tone = 'neutral' }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card/60 p-3">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
        {label}
      </div>
      <div
        className={clsx(
          'mt-1 font-mono text-lg font-semibold',
          tone === 'win' && 'text-success',
          tone === 'loss' && 'text-destructive',
          tone === 'neutral' && 'text-foreground',
        )}
      >
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}
