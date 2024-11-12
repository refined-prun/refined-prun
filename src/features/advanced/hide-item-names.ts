import css from '@src/utils/css-utils.module.css';
import classes from './hide-item-names.module.css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(C.GridItemView.name, css.hidden);
  // Remove gaps between items in GridView
  applyClassCssRule(C.GridItemView.container, classes.gridItem);
}

features.add(
  import.meta.url,
  init,
  'Hides item names and removes item grid gaps in all inventories.',
);
