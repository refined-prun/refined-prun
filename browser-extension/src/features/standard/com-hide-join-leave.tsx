import css from '@src/utils/css-utils.module.css';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

export function init() {
  applyCssRule(
    `.${PrunCss.Message.message}:not(:has(> .${PrunCss.Message.name} > div))`,
    css.hidden,
  );
}

void features.add({
  id: 'com-hide-join-leave',
  init,
});
