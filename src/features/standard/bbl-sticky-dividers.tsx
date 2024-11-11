import classes from './bbl-sticky-dividers.module.css';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { applyScopedClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyScopedClassCssRule('BBL', PrunCss.SectionList.divider, classes.divider);
}

features.add({
  id: 'bbl-sticky-dividers',
  description: 'BBL: Makes building category dividers sticky.',
  init,
});
