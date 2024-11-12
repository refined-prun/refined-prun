import classes from './expanded-tile-controls.module.css';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import css from '@src/utils/css-utils.module.css';

function init() {
  applyCssRule(`.${C.TileControls.container} > .${C.TileControls.icon}`, css.hidden);
  applyCssRule(`.${C.TileControls.container} > .${C.TileControls.controls}`, classes.show);
}

features.add({
  id: 'expanded-tile-controls',
  description: 'Makes tile controls always visible.',
  advanced: true,
  init,
});
