import css from '@src/utils/css-utils.module.css';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyCssRule(`.${C.ContextControls.item}:hover .${C.ContextControls.label}`, css.hidden);
}

features.add(
  import.meta.url,
  init,
  'Prevents the context controls from displaying description while hovering over.',
);
