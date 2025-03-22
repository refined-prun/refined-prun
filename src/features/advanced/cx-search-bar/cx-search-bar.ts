import MaterialSearchAndResults from './MaterialSearchAndResults.vue';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import classes from './cx-search-bar.module.css';
import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import css from '@src/utils/css-utils.module.css';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ComExPanel.input), comExPanel => {
    const actionBar = _$(comExPanel, C.ActionBar.container)!;

    const store = reactive({
      matchedTickers: new Set<string>(),
      matchedCategories: new Set<string>(),
      collapseOthers: false,
    });

    createFragmentApp(
      MaterialSearchAndResults,
      reactive({
        node: comExPanel,
        store: store,
      }),
    ).before(actionBar.children[0]);

    const options = _$$(comExPanel, 'option')!;
    for (const option of options) {
      const value = option.getAttribute('value')!;
      watchEffectWhileNodeAlive(option, () => {
        const isMatch = store.matchedCategories.has(value);
        option.classList.toggle(classes.matchingCategory, isMatch);
        option.classList.toggle(css.hidden, !isMatch && store.collapseOthers);
      });
    }

    subscribe($$(comExPanel, 'tbody'), tbody => {
      subscribe($$(tbody, 'tr'), tr => {
        const labelText = _$(tr, C.ColoredIcon.label)!.innerText;
        watchEffectWhileNodeAlive(tr, () => {
          const isMatch = store.matchedTickers.has(labelText);
          tr.classList.toggle(classes.matchingRow, isMatch);
          tr.classList.toggle(css.hidden, !isMatch && store.collapseOthers);
        });
      });
    });
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
