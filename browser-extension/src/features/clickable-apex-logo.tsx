import './clickable-apex-logo.css';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import PrunCss from '@src/prun-ui/prun-css';
import features from '@src/feature-registry';
import { showBuffer } from '@src/util';
import { companyStore } from '@src/prun-api/data/company';
import { applyClassCssRule } from '@src/prun-ui/refined-prun-css';

export function init() {
  applyClassCssRule(PrunCss.Frame.logo, 'logo');
  observeReadyElementsByClassName(PrunCss.Frame.logo, logo =>
    logo.addEventListener('click', () => showBuffer(`CO ${companyStore.code}`)),
  );
}

void features.add({
  id: 'clickable-apex-logo',
  init,
});
