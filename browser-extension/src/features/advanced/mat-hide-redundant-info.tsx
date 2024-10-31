import css from '@src/utils/css-utils.module.css';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyScopedCssRule(
    'MAT',
    `.${PrunCss.MaterialInformation.container} > .${PrunCss.FormComponent.containerPassive}:nth-child(2)`,
    css.hidden,
  );
  applyScopedCssRule(
    'MAT',
    `.${PrunCss.MaterialInformation.container} > .${PrunCss.FormComponent.containerPassive}:nth-child(6)`,
    css.hidden,
  );
}

void features.add({
  id: 'mat-hide-redundant-info',
  advanced: true,
  init,
});
