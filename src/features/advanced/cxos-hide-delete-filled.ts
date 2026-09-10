import css from '@src/utils/css-utils.module.css';

function init() {
  // This selector will only trigger when the filters are hidden, since there will be
  // no other elements between the "clear material filters" button and
  // the action bar with the "Delete Filled" button.
  applyCssRule('CXOS', `.${C.Button.btn} + .${C.ActionBar.container}`, css.hidden);
}

features.add(
  import.meta.url,
  init,
  'CXOS: Hides the "Delete Filled" button when filters are hidden.',
);
