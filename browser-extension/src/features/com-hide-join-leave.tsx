import './com-hide-join-leave.css';
import features from '@src/feature-registry';
import PrunCss from '@src/prun-ui/prun-css';
import { applyCssRule } from '@src/prun-ui/refined-prun-css';

export function init() {
  applyCssRule(
    `.${PrunCss.Message.message}:not(:has(> .${PrunCss.Message.name} > div))`,
    'message',
  );
}

void features.add({
  id: 'com-hide-join-leave',
  init,
});
