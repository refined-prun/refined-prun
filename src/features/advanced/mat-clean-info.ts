import css from '@src/utils/css-utils.module.css';
import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyScopedCssRule(
    'MAT',
    `.${C.MaterialInformation.container} > .${C.FormComponent.containerPassive}:nth-child(2)`,
    css.hidden,
  );
  applyScopedCssRule(
    'MAT',
    `.${C.MaterialInformation.container} > .${C.FormComponent.containerPassive}:nth-child(6)`,
    css.hidden,
  );
}

features.add(import.meta.url, init, 'MAT: Hides "Ticker" and "Natural resource" fields.');
