import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { HistoryFilters } from './HistoryFilters';
import { HistoryRow } from './HistoryRow';
import { useBetHistory } from '@/hooks';
import { useFilterStore } from '@/store';

export function HistoryTable() {
  const { bets, filteredBets, isLoading, isError, error, refetch } = useBetHistory();
  const reset = useFilterStore((s) => s.reset);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bet history</CardTitle>
        <CardDescription>Your most recent 20 bets.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <HistoryFilters />

          {isError ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              {(error as Error).message}{' '}
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 underline hover:text-destructive"
              >
                Retry
              </button>
            </div>
          ) : isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg border bg-card/60" />
              ))}
            </div>
          ) : bets.length === 0 ? (
            <EmptyState message="No bets placed yet. Flip the coin to get started." />
          ) : filteredBets.length === 0 ? (
            <EmptyState
              message="No bets match your filters."
              action={
                <Button variant="secondary" size="sm" onClick={reset}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-muted/60 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Amount</th>
                    <th className="px-4 py-2.5 font-medium">Currency</th>
                    <th className="px-4 py-2.5 font-medium">Outcome</th>
                    <th className="px-4 py-2.5 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBets.map((bet) => (
                    <HistoryRow key={bet.id} bet={bet} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-card/30 p-10 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}
