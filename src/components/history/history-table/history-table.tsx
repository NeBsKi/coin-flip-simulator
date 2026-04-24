import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  SectionErrorState,
} from '@/components/ui';
import { HISTORY_LIMIT } from '@/constants';
import { useBetHistory } from '@/hooks';
import { useFilterStore } from '@/store';
import { getErrorMessage } from '@/lib/get-error-message';
import { HistoryFilters } from '../history-filters';
import { HistoryRow } from '../history-row';
import type { EmptyStateProps } from './history-table.types';

export function HistoryTable() {
  const { bets, filteredBets, isLoading, isError, error, refetch } = useBetHistory();
  const reset = useFilterStore((s) => s.reset);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bet history</CardTitle>
        <CardDescription>Your most recent {HISTORY_LIMIT} bets.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <HistoryFilters />

          {isError ? (
            <SectionErrorState message={getErrorMessage(error)} onAction={() => refetch()} />
          ) : isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-lg border bg-card/60 motion-safe:animate-pulse"
                />
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
                <caption className="sr-only">Recent betting history</caption>
                <thead>
                  <tr className="border-b bg-muted/60 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Amount
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Currency
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Outcome
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Time
                    </th>
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

function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-card/30 p-10 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}
