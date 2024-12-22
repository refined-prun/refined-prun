import css from '@src/utils/css-utils.module.css';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  // Unfortunately, there are two classes that start with 'ContextControls__container'.
  // And 'ContextControls__container___pADKUO4' is not available in imported classes.
  applyCssRule(`.ContextControls__container___pADKUO4 > .${C.HeadItem.container}`, css.hidden);
}

features.add(import.meta.url, init, 'Hides the current context name label (CTX).');
