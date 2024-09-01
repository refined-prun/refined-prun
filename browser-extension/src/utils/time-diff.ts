export function diffDays(from: number, to: number, float = false) {
  const diff = to - from;
  const days = diff / 86400000;
  return float ? days : days >= 0 ? Math.floor(days) : Math.ceil(days);
}
