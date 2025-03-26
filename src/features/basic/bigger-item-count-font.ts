import classes from './bigger-item-count-font.module.css';

function init() {
  applyCssRule(`.${C.MaterialIcon.typeVerySmall}`, classes.indicator);
}

features.add(import.meta.url, init, 'Makes the item count label font bigger.');
