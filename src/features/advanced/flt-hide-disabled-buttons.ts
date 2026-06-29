import css from '@src/utils/css-utils.module.css';

function init() {
  applyCssRule(['FLT', 'FLTS', 'FLTP'], `.${C.Button.disabledInline}`, css.hidden);
}

features.add(import.meta.url, init, 'FLT: Hides disabled commands (like unload)');
