import css from '@src/utils/css-utils.module.css';

function init() {
  applyCssRule(`.${C.ContextControls.item}:hover .${C.ContextControls.label}`, css.hidden);
}

features.add(
  import.meta.url,
  init,
  'Prevents the context controls from displaying description while hovering over.',
);
