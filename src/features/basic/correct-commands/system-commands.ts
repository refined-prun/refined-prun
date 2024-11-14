import { getStarNaturalId, starsStore } from '@src/infrastructure/prun-api/data/stars';

const correctableCommands = new Set(['FLTS', 'INF', 'MS', 'SYSI']);

export function correctSystemCommand(parts: string[]) {
  if (!correctableCommands.has(parts[0].toUpperCase())) {
    return;
  }

  const args = parts.slice(1);
  const starName = args.join(' ');
  const star = starsStore.getByName(starName);
  if (!star) {
    return;
  }

  const naturalId = getStarNaturalId(star);
  if (starName !== naturalId) {
    parts.splice(1);
    parts.push(naturalId);
  }
}
