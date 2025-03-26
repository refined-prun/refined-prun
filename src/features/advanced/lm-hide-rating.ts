import css from '@src/utils/css-utils.module.css';
import classes from './lm-hide-rating.module.css';

function init() {
  applyCssRule('LM', `.${C.RatingIcon.container}`, css.hidden);
  applyCssRule('LM', `.${C.CommodityAd.text}`, classes.text);
}

features.add(import.meta.url, init, 'LM: Hides rating icon from ads.');
