import css from '@src/utils/css-utils.module.css';

function init() {
  applyCssRule(`.${C.StoreView.name}`, css.hidden);
}

features.add(import.meta.url, init, 'Hides "Weight" and "Volume" labels in all inventories.');
