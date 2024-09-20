import classes from './clickable-apex-logo.module.css';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

export function init() {
  applyClassCssRule(PrunCss.Frame.logo, classes.logo);
  observeReadyElementsByClassName(PrunCss.Frame.logo, logo =>
    logo.addEventListener('click', () => showBuffer(`CO ${companyStore.value?.code}`)),
  );
}

void features.add({
  id: 'clickable-apex-logo',
  init,
});
