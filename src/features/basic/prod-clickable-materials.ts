import classes from './prod-clickable-materials.module.css';
import { applyScopedClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyScopedClassCssRule('PROD', C.OrderTile.production, classes.disablePointerEvents);
  applyScopedClassCssRule('PROD', C.OrderTile.queue, classes.disablePointerEvents);
  applyScopedClassCssRule('PRODQ', C.OrderTile.overlay, classes.disablePointerEvents);
}

features.add(import.meta.url, init, 'PROD: Allows the materials in PROD to be clicked');
