import css from '@src/utils/css-utils.module.css';

function init() {
  applyCssRule(
    'MAT',
    `.${C.MaterialInformation.container} > .${C.FormComponent.containerPassive}:nth-child(2)`,
    css.hidden,
  );
  applyCssRule(
    'MAT',
    `.${C.MaterialInformation.container} > .${C.FormComponent.containerPassive}:nth-child(6)`,
    css.hidden,
  );
}

features.add(import.meta.url, init, 'MAT: Hides "Ticker" and "Natural resource" fields.');
