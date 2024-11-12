import classes from './fix-z-order.module.css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(
    [C.ComExOrdersPanel.filter, C.LocalMarket.filter, C.ContractsListTable.filter],
    classes.filter,
  );
  applyClassCssRule(C.ScrollView.track, classes.scrollTrack);
}

features.add(import.meta.url, init, 'Fixes the CSS z-order of some elements.');
