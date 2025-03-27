import MaterialSearchAndResults from './MaterialSearchAndResults.vue';
import $style from './cx-search-bar.module.css';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ComExPanel.input), comExPanel => {
    const actionBar = _$(comExPanel, C.ActionBar.container)!;

    createFragmentApp(
      MaterialSearchAndResults,
      reactive({
        comExPanel: comExPanel,
      }),
    ).before(actionBar.children[0]);
  });
}

function init() {
  applyCssRule('CX', `.${C.BrokerList.table}`, $style.table);
  tiles.observe('CX', onTileReady);
}

features.add(import.meta.url, init, 'CX: Adds a search bar to highlight materials and categories.');
