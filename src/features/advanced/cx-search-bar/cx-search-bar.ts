import { refAttributeValue, refTextContent } from '@src/utils/reactive-dom';
import MaterialSearchAndResults from './MaterialSearchAndResults.vue';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import classes from './cx-search-bar.module.css';
import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import css from '@src/utils/css-utils.module.css';

export const store = reactive({
  matchedMaterials: [] as PrunApi.Material[],
  collapseOthers: false,
});

function onTileReady(tile: PrunTile) {
  const parameter = tile.parameter;
  if (!parameter) {
    return;
  }

  subscribe($$(tile.anchor, C.ComExPanel.input), comExPanel => {
    const actionBar = _$(comExPanel, C.ActionBar.container)!;

    createFragmentApp(
      MaterialSearchAndResults,
      reactive({
        node: comExPanel,
      }),
    ).before(actionBar.children[0]);

    const options = _$$(comExPanel, 'option')!;
    for (const option of options) {
      const value = option.getAttribute('value');
      watchEffectWhileNodeAlive(option, () => {
        const isMatch = store.matchedMaterials.some(material => value === material.category);
        setClassesForElement(option, isMatch, classes.matchingCategory);
      });
    }

    subscribe($$(comExPanel, 'tbody'), tbody => {
      subscribe($$(tbody, 'tr'), tr => {
        const labelText = _$(tr, C.ColoredIcon.label)!.innerText;
        watchEffectWhileNodeAlive(tr, () => {
          const isMatch = store.matchedMaterials.some(material => labelText === material.ticker);
          setClassesForElement(tr, isMatch, classes.matchingRow);
        });
      });
    });
  });
}

function setClassesForElement(element: HTMLElement, isMatch: boolean, matchClass: string) {
  element.classList.toggle(matchClass, isMatch);
  element.classList.toggle(css.hidden, !isMatch && store.collapseOthers);
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
