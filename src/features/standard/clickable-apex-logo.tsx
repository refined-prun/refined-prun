import classes from './clickable-apex-logo.module.css';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

function init() {
  applyClassCssRule(C.Frame.logo, classes.logo);
  subscribe($$(document, C.Frame.logo), logo => {
    logo.addEventListener('click', () => showBuffer(`CO ${companyStore.value?.code}`));
  });
}

features.add({
  id: 'clickable-apex-logo',
  description: 'Makes the APEX logo clickable and leading to the user company info screen.',
  init,
});
