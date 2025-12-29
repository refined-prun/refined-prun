import { cxpcStore } from '@src/infrastructure/prun-api/data/cxpc';
import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ChartContainer.settings), async settings => {
    await waitInitialCxpcResponse(tile.parameter!);
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

// The 1y request will not be sent if the initial response has not arrived yet.
async function waitInitialCxpcResponse(ticker: string) {
  const broker = computed(() => cxobStore.getByTicker(ticker));
  await new Promise<void>(resolve => {
    const check = (data: PrunApi.CXBrokerPrices) => {
      if (data.brokerId === broker.value?.id) {
        resolve();
        cxpcStore.offPricesReceived(check);
      }
    };
    cxpcStore.onPricesReceived(check);
  });
}

function init() {
  tiles.observe('CXPC', onTileReady);
}

features.add(import.meta.url, init, 'CXPC: Selects the 1y chart on open.');
