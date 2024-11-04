import classes from './com-move-delete-button.module.css';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { applyClassCssRule, applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(PrunCss.Message.controlsAndText, classes.container);
  applyClassCssRule(PrunCss.Message.controls, classes.delete);
  applyCssRule(
    `.${PrunCss.Message.message}:has(.${PrunCss.Message.controlsAndText} .${PrunCss.Message.controls}) .${PrunCss.Sender.name}`,
    classes.username,
  );
}

features.add({
  id: 'com-move-delete-button',
  description: 'COM: Moves the "delete" button to prevent the message layout shift.',
  init,
});
