import classes from './clickable-apex-logo.module.css';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { $$ } from '@src/utils/select-dom';

function init() {
  applyClassCssRule(PrunCss.Frame.logo, classes.logo);
  subscribe($$(document, PrunCss.Frame.logo), logo => {
    logo.addEventListener('click', () => showBuffer(`CO ${companyStore.value?.code}`));
  });
}

features.add({
  id: 'clickable-apex-logo',
  description: 'Makes the APEX logo clickable and leading to the user company info screen.',
  init,
});
