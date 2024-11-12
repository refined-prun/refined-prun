import classes from './fix-z-order.module.css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(
    [
      PrunCss.ComExOrdersPanel.filter,
      PrunCss.LocalMarket.filter,
      PrunCss.ContractsListTable.filter,
    ],
    classes.filter,
  );
  applyClassCssRule(PrunCss.ScrollView.track, classes.scrollTrack);
}

features.add({
  id: 'fix-z-order',
  description: 'Fixes the CSS z-order of some elements.',
  init,
});
