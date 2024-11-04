import classes from './fix-z-order.module.css';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule([PrunCss.ComExOrdersPanel.filter, PrunCss.LocalMarket.filter], classes.filter);
  applyClassCssRule(PrunCss.ScrollView.track, classes.scrollTrack);
}

features.add({
  id: 'fix-z-order',
  description: 'Fixes the CSS z-order of some elements.',
  init,
});
