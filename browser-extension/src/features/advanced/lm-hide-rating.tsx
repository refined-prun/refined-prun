import css from '@src/utils/css-utils.module.css';
import classes from './lm-hide-rating.module.css';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { applyScopedClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

export function init() {
  applyScopedClassCssRule('LM', PrunCss.RatingIcon.container, css.hidden);
  applyScopedClassCssRule('LM', PrunCss.CommodityAd.text, classes.text);
}

void features.add({
  id: 'lm-hide-rating',
  description: 'LM: Hides rating icon from ads.',
  advanced: true,
  init,
});
