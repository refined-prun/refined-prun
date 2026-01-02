import { cxpcStore } from '@src/infrastructure/prun-api/data/cxpc';
import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import { watchWhile } from '@src/utils/watch';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ChartContainer.settings), async settings => {
    // The 1y request will not be sent if the initial 30d response has not arrived yet.
    await watchWhile(() => {
      const broker = cxobStore.getByTicker(tile.parameter);
      const cxpc = cxpcStore.getById(broker?.id);
      return cxpc === undefined;
    });

    const radioGroups = _$$(settings, C.RadioGroup.container);
    if (radioGroups.length === 0) {
      return;
    }

    const timeRangeGroup = radioGroups[0];
    const rangeButtons = _$$(timeRangeGroup, C.RadioItem.container);
    if (rangeButtons.length === 0) {
      return;
    }
    const yearButton = rangeButtons[rangeButtons.length - 1];
    yearButton?.click();
  });
}

function init() {
  tiles.observe('CXPC', onTileReady);
}

features.add(import.meta.url, init, 'CXPC: Selects the 1y chart on open.');
