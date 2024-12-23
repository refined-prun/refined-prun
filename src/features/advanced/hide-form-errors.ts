import css from '@src/utils/css-utils.module.css';
import classes from './hide-form-errors.module.css';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  // Hide error messages in form components
  // Remove hard-coded ones when molp fixes class duplication
  applyClassCssRule(C.FormComponent.containerError, classes.containerError);
  applyClassCssRule('FormComponent__containerError___pN__L1Q', classes.containerError);
  applyClassCssRule(C.FormComponent.errorMessage, css.hidden);
  applyClassCssRule('FormComponent__errorMessage___mBdvpz5', css.hidden);
}

features.add(import.meta.url, init, 'Hides error labels from form fields with incorrect input.');
