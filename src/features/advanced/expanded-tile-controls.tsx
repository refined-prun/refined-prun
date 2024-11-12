import classes from './expanded-tile-controls.module.css';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import css from '@src/utils/css-utils.module.css';

function init() {
  applyCssRule(`.${PrunCss.TileControls.container} > .${PrunCss.TileControls.icon}`, css.hidden);
  applyCssRule(
    `.${PrunCss.TileControls.container} > .${PrunCss.TileControls.controls}`,
    classes.show,
  );
}

features.add({
  id: 'expanded-tile-controls',
  description: 'Makes tile controls always visible.',
  advanced: true,
  init,
});
