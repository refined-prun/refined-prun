import classes from './icons-better-colors.module.css';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyCategoryRule('agricultural products', classes.agriculturalProducts);
  applyCategoryRule('consumables (basic)', classes.consumablesBasic);
  applyCategoryRule('consumables (luxury)', classes.consumablesLuxury);
  applyCategoryRule('fuels', classes.fuels);
  applyCategoryRule('liquids', classes.liquids);
  applyCategoryRule('plastics', classes.plastics);
}

function applyCategoryRule(category: string, rule: string) {
  applyCssRule(`.${PrunCss.ColoredIcon.container}[data-rp-category='${category}']`, rule);
}

void features.add({
  id: 'icons-better-colors',
  init,
});
