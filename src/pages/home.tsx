import { BetPanel, HistoryTable, StatsPanel } from '@/components';
import { useBetHistory, useUser } from '@/hooks';
import { useGameStore } from '@/store';
import { getErrorMessage } from '@/lib/get-error-message';
import { formatCredits } from '@/lib/utils';

export function Home() {
  const { data: user, isLoading: userLoading } = useUser();
  const {
    allStats,
    isLoading: historyLoading,
    isError: historyError,
    error: historyQueryError,
    refetch: refetchHistory,
  } = useBetHistory();
  const { currency } = useGameStore();

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <span className="text-base font-bold">₵</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {userLoading ? (
              <div className="h-9 w-28 rounded-md bg-muted motion-safe:animate-pulse" />
            ) : user ? (
              <div className="hidden text-right sm:block">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  Current balance
                </div>
                <div className="font-mono text-sm text-foreground">
                  {formatCredits(user.balances[currency])} {currency}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <BetPanel />
        <StatsPanel
          stats={allStats}
          loading={historyLoading}
          errorMessage={historyError ? getErrorMessage(historyQueryError) : null}
          onRetry={refetchHistory}
        />
        <HistoryTable />
      </main>
    </div>
  );
}
