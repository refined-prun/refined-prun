import css from '@src/utils/css-utils.module.css';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyCssRule(
    `.${PrunCss.Message.message}:not(:has(> .${PrunCss.Message.name} > div))`,
    css.hidden,
  );
}

features.add({
  id: 'com-hide-join-leave',
  description: 'COM: Hides "User joined" and "User left" messages.',
  advanced: true,
  init,
});
