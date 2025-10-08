import css from '@src/utils/css-utils.module.css';

function init() {
  applyCssRule('CXOS', `button + .${C.ActionBar.container} .${C.Button.danger}`, css.hidden);
}

features.add(import.meta.url, init, 'CXOS: Hides the "Delete Filled" button.');
