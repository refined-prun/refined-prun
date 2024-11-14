import classes from './bbl-sticky-dividers.module.css';
import { applyScopedClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyScopedClassCssRule('BBL', C.SectionList.divider, classes.divider);
}

features.add(import.meta.url, init, 'BBL: Makes building category dividers sticky.');
