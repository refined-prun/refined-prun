import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import css from '@src/utils/css-utils.module.css';

function init() {
  const selector = `.${C.Tile.tile} .${C.TileControls.splitControls} + .${C.TileControls.control}`;
  applyCssRule(`.${C.MainState.tileContainer} > ${selector}`, css.hidden);
  applyCssRule(`.${C.Window.body} > ${selector}`, css.hidden);
}

features.add(
  import.meta.url,
  init,
  'Hides the close button on single tile windows where it does nothing.',
);
