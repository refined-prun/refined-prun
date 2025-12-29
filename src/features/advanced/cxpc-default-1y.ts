function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ChartContainer.settings), settings => {
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
