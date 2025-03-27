import css from '@src/utils/css-utils.module.css';

function init() {
  applyCssRule('SHPF', `.${C.InventorySortControls.controls}`, css.hidden);
}

features.add(import.meta.url, init, 'SHPF: Hides inventory sort options.');
