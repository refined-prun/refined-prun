import css from '@src/utils/css-utils.module.css';
import $style from './hide-item-names.module.css';

function init() {
  applyCssRule(`.${C.GridItemView.name}`, css.hidden);
  // Remove gaps between items in GridView
  applyCssRule(`.${C.GridItemView.container}`, $style.gridItem);
}

features.add(
  import.meta.url,
  init,
  'Hides item names and removes item grid gaps in all inventories.',
);
