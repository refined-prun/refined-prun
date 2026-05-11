import css from '@src/utils/css-utils.module.css';
import $style from './adm-hide-inactive-buttons.module.css';

function init() {
  // The VOTE button is disabled for the first 1 second after opening the ADM tile,
  // so we cannot just hide all the disabled buttons. Instead, show the disabled
  // VOTE button if both the VOTE and the WITHDRAW buttons are disabled.
  applyCssRule(
    'ADM',
    `.${C.UpcomingTerm.container} .${C.Button.disabled}:not(:has(+ .${C.Button.disabled}))`,
    css.hidden,
  );
  applyCssRule('ADM', `.${C.UpcomingTerm.container} .${C.Button.btn}`, $style.button);
}

features.add(import.meta.url, init, 'ADM: Hides inactive buttons.');
