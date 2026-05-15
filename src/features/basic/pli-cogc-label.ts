import { planetsStore } from '@src/infrastructure/prun-api/data/planets';

function formatCogcLabel(programType?: string | null) {
  if (!programType) {
    return 'COGC (Inactive)';
  }
  const cleaned = programType
    .replace(/^(ADVERTISING|WORKFORCE)_/, '')
    .replace(/^\w/, c => c.toUpperCase())
    .replace(/\w+$/, c => c.toLowerCase());
  return `COGC (${cleaned})`;
}

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.PlanetaryProjectsList.row), row => {
    const link = _$(row, C.Link.link);
    if (!link || link.textContent !== 'Chamber of Global Commerce') {
      return;
    }
    const programType = planetsStore.find(tile.parameter)?.cogcProgramType;
    link.textContent = formatCogcLabel(programType);
  });
}

function init() {
  tiles.observe('PLI', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'PLI: Replaces "Chamber of Global Commerce" row label with "COGC ({program type})".',
);
