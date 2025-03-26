import css from '@src/utils/css-utils.module.css';
import $style from './hide-form-errors.module.css';

function init() {
  // Hide error messages in form components
  // Remove hard-coded ones when molp fixes class duplication
  applyCssRule('.FormComponent__containerError___pN__L1Q', $style.containerError);
  applyCssRule('.FormComponent__containerError___jKoukmU', $style.containerError);
  applyCssRule('.FormComponent__errorMessage___mBdvpz5', css.hidden);
  applyCssRule('.FormComponent__errorMessage___R2eGj1h', css.hidden);
}

features.add(import.meta.url, init, 'Hides error labels from form fields with incorrect input.');
