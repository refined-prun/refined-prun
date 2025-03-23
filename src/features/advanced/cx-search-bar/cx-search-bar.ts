import MaterialSearchAndResults from './MaterialSearchAndResults.vue';
import classes from './cx-search-bar.module.css';
import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

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
  applyScopedCssRule('CX', `.${C.BrokerList.table} tbody tr:nth-child(2n+1)`, classes.rowOdd);
  applyScopedCssRule(
    'CX',
    `.${C.BrokerList.table} tbody tr:nth-child(2n+1)::after`,
    classes.rowAfter,
  );
  tiles.observe('CX', onTileReady);
}

features.add(import.meta.url, init, 'CX: Adds a search bar to highlight materials and categories.');
