export function numberOrNull(raw: string): number | null {
  if (raw.trim() === '') return null;

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}
