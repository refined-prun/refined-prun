import css from '@src/utils/css-utils.module.css';
import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyScopedCssRule(
    'BBL',
    `.${C.SectionList.section} .${C.SectionList.table} tr:nth-child(5)`,
    css.hidden,
  );
}

features.add(import.meta.url, init, 'BBL: Hides the "Book value" row.');
