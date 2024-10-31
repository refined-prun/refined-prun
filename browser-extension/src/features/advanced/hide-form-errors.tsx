import css from '@src/utils/css-utils.module.css';
import classes from './hide-form-errors.module.css';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

export function init() {
  // Hide error messages in form components
  // Remove hard-coded ones when molp fixes class duplication
  applyClassCssRule(PrunCss.FormComponent.containerError, classes.containerError);
  applyClassCssRule('FormComponent__containerError___pN__L1Q', classes.containerError);
  applyClassCssRule(PrunCss.FormComponent.errorMessage, css.hidden);
  applyClassCssRule('FormComponent__errorMessage___mBdvpz5', css.hidden);
}

void features.add({
  id: 'hide-form-errors',
  advanced: true,
  init,
});
