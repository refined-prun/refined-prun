import $style from './table-rows-alternating-colors.module.css';

function init() {
  applyCssRule('table', $style.table);
}

features.add(import.meta.url, init, 'Colors even rows in lighter color in all tables.');
