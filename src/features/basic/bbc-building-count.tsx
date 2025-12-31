import css from '@src/utils/css-utils.module.css';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';

function onTileReady(tile: PrunTile) {
  const naturalId = tile.parameter;
  const totals = computed(() => {
    const totals = new Map<string, number>();
    const buildings = sitesStore.getByPlanetNaturalId(naturalId)?.platforms ?? [];
    for (const building of buildings) {
      const ticker = building.module.reactorTicker;
      totals.set(ticker, (totals.get(ticker) ?? 0) + 1);
    }
    return totals;
  });

  subscribe($$(tile.anchor, C.BuildingIcon.tickerContainer), tickerContainer => {
    const ticker = tickerContainer.textContent;
    if (!ticker) {
      return;
    }

    const count = computed(() => totals.value.get(ticker) ?? 0);
    const isVisible = computed(() => count.value > 1);
    const hiddenClass = computed(() => (isVisible.value ? undefined : css.hidden));

    createFragmentApp(() => (
      <div class={[C.MaterialIcon.indicatorContainer, hiddenClass.value]}>
        <div
          class={[C.MaterialIcon.indicator, C.MaterialIcon.neutral, C.MaterialIcon.typeVerySmall]}>
          {totals.value.get(ticker)}
        </div>
      </div>
    )).appendTo(tickerContainer);
  });
}

function init() {
  tiles.observe('BBC', onTileReady);
}

features.add(import.meta.url, init, 'BBC: Adds a building count label to the building icons.');
