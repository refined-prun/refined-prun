export function sameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return `${day}/${month}/${year}`;
}

export function formatTime(date: Date) {
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${hours}:${minutes}:${seconds}`;
}

export function pad(number: number) {
  return (number < 10 ? '0' : '') + number;
}

export function formatPrice(x: string) {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
