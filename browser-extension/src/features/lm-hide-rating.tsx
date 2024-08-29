import './lm-hide-rating.css';
import features from '@src/feature-registry';
import PrunCss from '@src/prun-ui/prun-css';
import { applyScopedClassCssRule } from '@src/prun-ui/refined-prun-css';

export function init() {
  applyScopedClassCssRule('LM', PrunCss.RatingIcon.container, 'icon');
  applyScopedClassCssRule('LM', PrunCss.CommodityAd.text, 'text');
}

void features.add({
  id: 'lm-hide-rating',
  init,
});
