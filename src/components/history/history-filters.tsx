import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { useFilterStore } from '@/store';

export function HistoryFilters() {
  const { outcome, minAmount, maxAmount, setOutcome, setMinAmount, setMaxAmount } =
    useFilterStore();

  const parseAmount = (value: string): number | null => {
    if (value.trim() === '') return null;
    const num = Number(value);
    return num >= 0 ? num : null;
  };

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="space-y-1.5">
        <Label htmlFor="filter-outcome">Outcome</Label>
        <Select value={outcome} onValueChange={(v) => setOutcome(v as typeof outcome)}>
          <SelectTrigger id="filter-outcome">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All outcomes</SelectItem>
            <SelectItem value="win">Wins only</SelectItem>
            <SelectItem value="loss">Losses only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-min">Min amount</Label>
        <Input
          id="filter-min"
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          placeholder="Any"
          value={minAmount ?? ''}
          onChange={(e) => setMinAmount(parseAmount(e.target.value))}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-max">Max amount</Label>
        <Input
          id="filter-max"
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          placeholder="Any"
          value={maxAmount ?? ''}
          onChange={(e) => setMaxAmount(parseAmount(e.target.value))}
        />
      </div>
    </div>
  );
}
