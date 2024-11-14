export function correctXitArgs(parts: string[]) {
  if (parts[0].toUpperCase() !== 'XIT') {
    return;
  }

  const args = parts.slice(1);
  if (args.length < 5 && args.every(x => x.length > 1)) {
    return;
  }

  parts.splice(1);
  parts.push(args.filter(x => x).join('_'));
}
