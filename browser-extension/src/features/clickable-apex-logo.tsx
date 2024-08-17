import './clickable-apex-logo.css';
import { observeReadyElementsByClassName } from '../utils/mutation-observer';
import PrunCss from '../prun-ui/prun-css';
import features from '../feature-registry';
import { showBuffer } from '@src/util';
import { companyStore } from '@src/prun-api/data/company';

function onLogoReady(logo: HTMLDivElement) {
  logo.addEventListener('click', () => {
    showBuffer(`CO ${companyStore.code}`);
  });
}

export function init() {
  observeReadyElementsByClassName(PrunCss.Frame.logo, onLogoReady);
}

void features.add({
  id: 'clickable-apex-logo',
  init,
  attribute: true,
});
