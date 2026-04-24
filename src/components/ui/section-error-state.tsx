import { Button } from './button';

interface SectionErrorStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionErrorState({
  message,
  actionLabel = 'Retry',
  onAction,
}: SectionErrorStateProps) {
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
      <p>{message}</p>
      {onAction ? (
        <div className="mt-3">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
