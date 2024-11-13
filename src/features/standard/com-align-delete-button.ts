import classes from './com-align-delete-button.module.css';
import { applyClassCssRule, applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyClassCssRule(C.Message.controlsAndText, classes.container);
  applyClassCssRule(C.Message.controls, classes.delete);
  applyCssRule(
    `.${C.Message.message}:has(.${C.Message.controlsAndText} .${C.Message.controls}) .${C.Sender.name}`,
    classes.username,
  );
}

features.add(
  import.meta.url,
  init,
  'COM: Moves the "delete" button to prevent the message layout shift.',
);