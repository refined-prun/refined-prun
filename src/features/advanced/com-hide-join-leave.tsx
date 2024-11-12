import css from '@src/utils/css-utils.module.css';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyCssRule(`.${C.Message.message}:not(:has(> .${C.Message.name} > div))`, css.hidden);
}

features.add({
  id: 'com-hide-join-leave',
  description: 'COM: Hides "User joined" and "User left" messages.',
  advanced: true,
  init,
});
