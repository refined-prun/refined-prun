import { planetsStore } from '@src/infrastructure/prun-api/data/planets';

function formatCogcLabel(programType?: string | null) {
  if (!programType) {
    return 'CoGC (Inactive)';
  }
  const localized =
    L.CoGCProgram[`${programType}_SHORT` as keyof typeof L.CoGCProgram]?.() ??
    programType
      .replace(/^(ADVERTISING|WORKFORCE)_/, '')
      .replace(/^\w/, c => c.toUpperCase())
      .replace(/\w+$/, c => c.toLowerCase());
  return `CoGC (${localized})`;
}

function onTileReady(tile: PrunTile) {
  const localizedLabel = L.PlanetaryProjects.COGC();
  subscribe($$(tile.anchor, C.PlanetaryProjectsList.row), async row => {
    const link = await $(row, C.Link.link);
    if (link.textContent !== localizedLabel) {
      return;
    }
    const planet = planetsStore.find(tile.parameter);
    if (!planet) {
      return;
    }

    link.textContent = formatCogcLabel(planet.cogcProgramType);
  });
}

function init() {
  tiles.observe('PLI', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'PLI: Replaces "Chamber of Global Commerce" row label with "CoGC ({program type})".',
);
