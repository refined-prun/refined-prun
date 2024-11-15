export function toDueDate(date?: number | string | Date) {
  if (!date) {
    return undefined;
  }
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  return date.toISOString().slice(0, 10);
}
