import $style from './bigger-item-count-font.module.css';

function init() {
  applyCssRule(`.${C.MaterialIcon.typeVerySmall}`, $style.indicator);
}

features.add(import.meta.url, init, 'Makes the item count label font bigger.');
