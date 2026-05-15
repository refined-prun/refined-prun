import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { PrunI18N } from '@src/infrastructure/prun-ui/i18n';

function formatCogcLabel(programType?: string | null) {
  if (!programType) {
    return 'CoGC (Inactive)';
  }

  let localized = PrunI18N[`CoGCProgram.${programType}_SHORT`]?.[0]?.value;
  localized ??= programType
    .replace(/^(ADVERTISING|WORKFORCE)_/, '')
    .replace(/^\w/, c => c.toUpperCase())
    .replace(/\w+$/, c => c.toLowerCase());
  return `CoGC (${localized})`;
}

function onTileReady(tile: PrunTile) {
  const localizedLabel =
    PrunI18N['PlanetaryProjects.COGC']?.[0]?.value ?? 'Chamber of Global Commerce';
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
