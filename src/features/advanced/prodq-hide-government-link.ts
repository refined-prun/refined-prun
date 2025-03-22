import { applyScopedClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import css from '@src/utils/css-utils.module.css';

function init() {
  applyScopedClassCssRule('PRODQ', C.Link.link, css.hidden);
}

features.add(import.meta.url, init, 'PRODQ: Hides government links.');
