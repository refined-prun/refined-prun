import classes from './com-hide-join-leave.module.css';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

export function init() {
  applyCssRule(
    `.${PrunCss.Message.message}:not(:has(> .${PrunCss.Message.name} > div))`,
    classes.hide,
  );
}

void features.add({
  id: 'com-hide-join-leave',
  init,
});
