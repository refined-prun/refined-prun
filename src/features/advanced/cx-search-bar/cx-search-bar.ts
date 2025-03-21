import { refAttributeValue, refTextContent } from '@src/utils/reactive-dom';
import MaterialSearchAndResults from './MaterialSearchAndResults.vue';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import classes from './cx-search-bar.module.css';

export const store = reactive({
  foundMaterials: [] as PrunApi.Material[],
});

function onTileReady(tile: PrunTile) {
  const parameter = tile.parameter;
  if (!parameter) {
    return;
  }

  subscribe($$(tile.anchor, C.ComExPanel.input), comExPanel => {
    const actionBar = _$(comExPanel, C.ActionBar.container)!;

    createFragmentApp(MaterialSearchAndResults).before(actionBar.children[0]);

    subscribe($$(comExPanel, 'option'), option => {
      const value = refAttributeValue(option, 'value');
      watchEffectWhileNodeAlive(option, () => {
        for (const material of store.foundMaterials) {
          if (value.value === material.category) {
            option.classList.add(classes.matchingCategory);
            return;
          }
        }
        option.classList.remove(classes.matchingCategory);
      });
    });

    subscribe($$(comExPanel, 'tbody'), tbody => {
      subscribe($$(tbody, 'tr'), tr => {
        const material = _$(tr, C.ColoredIcon.label)!;
        const labelText = refTextContent(material);
        watchEffectWhileNodeAlive(tr, () => {
          for (const material of store.foundMaterials) {
            if (labelText.value?.toUpperCase() === material.ticker) {
              tr.classList.add(classes.matchingRow);
              return;
            }
          }
          tr.classList.remove(classes.matchingRow);
        });
      });
    });
  });
}

function init() {
  tiles.observe('CX', onTileReady);
}

features.add(import.meta.url, init, 'CX: Adds a search bar to highlight materials and categories.');
