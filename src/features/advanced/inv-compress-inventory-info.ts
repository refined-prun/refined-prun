import { applyScopedClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import classes from './inv-compress-inventory-info.module.css';

function init() {
  applyScopedClassCssRule('INV', C.StoreView.column, classes.storeViewColumn);
  applyScopedClassCssRule('INV', C.StoreView.container, classes.storeViewContainer);
}

features.add(import.meta.url, init, 'INV: Compresses specific inventory info into a row.');
