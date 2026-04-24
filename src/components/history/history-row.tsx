import { memo } from 'react';
import type { Bet } from '../../api/types';
import { Badge } from '@/components/ui';
import { formatCredits, formatTimestamp } from '@/lib/utils';

interface HistoryRowProps {
  bet: Bet;
}

function HistoryRowImpl({ bet }: HistoryRowProps) {
  const isWin = bet.outcome === 'win';

  return (
    <tr className="border-b last:border-b-0 hover:bg-muted/40">
      <td className="px-4 py-3 font-mono text-sm text-foreground">{formatCredits(bet.amount)}</td>
      <td className="px-4 py-3">
        <Badge variant="secondary">{bet.currency}</Badge>
      </td>
      <td className="px-4 py-3">
        {isWin ? <Badge variant="success">Win</Badge> : <Badge variant="destructive">Loss</Badge>}
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{formatTimestamp(bet.timestamp)}</td>
    </tr>
  );
}

export const HistoryRow = memo(HistoryRowImpl);
