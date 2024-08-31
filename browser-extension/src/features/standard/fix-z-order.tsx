import './fix-z-order.css';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

export function init() {
  applyClassCssRule([PrunCss.ComExOrdersPanel.filter, PrunCss.LocalMarket.filter], 'filter');
  applyClassCssRule(PrunCss.ScrollView.track, 'scroll-track');
}

void features.add({
  id: 'fix-z-order',
  init,
});
