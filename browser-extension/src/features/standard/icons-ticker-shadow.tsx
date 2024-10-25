import classes from './icons-ticker-shadow.module.css';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { applyClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { companyStore } from '@src/infrastructure/prun-api/data/company';

function init() {
  if (companyStore.value?.code === 'KCB') {
    return;
  }
  applyClassCssRule(PrunCss.ColoredIcon.label, classes.shadow);
}

void features.add({
  id: 'icons-ticker-shadow',
  init,
});
