import BuildingCountSection from './BuildingCountSection.vue';

function onTileReady(tile: PrunTile) {
  const naturalId = tile.parameter;
  if (!naturalId) {
    return;
  }

  subscribe($$(tile.anchor, C.Site.container), container => {
    createFragmentApp(BuildingCountSection, { naturalId }).appendTo(container);
  });
}

function init() {
  tiles.observe('BS', onTileReady);
}

features.add(import.meta.url, init, 'BS: Adds a building summary list.');
