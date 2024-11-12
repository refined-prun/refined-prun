import css from '@src/utils/css-utils.module.css';
import classes from './hide-item-names.module.css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(PrunCss.GridItemView.name, css.hidden);
  // Remove gaps between items in GridView
  applyClassCssRule(PrunCss.GridItemView.container, classes.gridItem);
}

features.add({
  id: 'hide-item-names',
  description: 'Hides item names and removes item grid gaps in all inventories.',
  advanced: true,
  init,
});
