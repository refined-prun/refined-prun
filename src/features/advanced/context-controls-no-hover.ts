import classes from './context-controls-no-hover.module.css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(
    `${C.ContextControls.item}:hover .${C.ContextControls.label}`,
    classes.stopDisplay,
  );
}

features.add(
  import.meta.url,
  init,
  'Prevents the context controls from displaying description while hovering over.',
);
