import $style from './tile-controls-background.module.css';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyCssRule(`.${C.TileFrame.controls}`, $style.controls);
}

features.add(
  import.meta.url,
  init,
  'Adds a solid color background to the top-right tile controls.',
);
