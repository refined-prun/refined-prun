import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import css from '@src/utils/css-utils.module.css';

function init() {
  applyCssRule(
    `.${C.Frame.uiToggles} .${C.Frame.toggle}:nth-child(3):has(.${C.Frame.toggleIndicatorPrimaryActive})`,
    css.hidden,
  );
}

features.add(
  import.meta.url,
  init,
  'Hides the BFRS (Toggle footer) button from left-top UI toggles. ' +
    'Warning: Refined PrUn features may not work properly with the hidden footer.',
);
