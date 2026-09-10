export function prunBtoa(input: string) {
  const base64 = btoa(input);
  return base64.replaceAll('+', '-').replaceAll('/', '.').replaceAll('=', '');
}

export function prunAtob(input: string) {
  let base64 = input.replaceAll('-', '+').replaceAll('.', '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return atob(base64);
}
