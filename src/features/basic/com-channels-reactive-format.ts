import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import classes from './com-channels-reactive-format.module.css';

function init() {
  const commands = ['COMP', 'COMG'];
  applyScopedCssRule(commands, `.${C.MessageList.messages} .${C.Message.message}`, classes.message);
  applyScopedCssRule(commands, `.${C.Message.message} .${C.Message.name}`, classes.messageName);
  applyScopedCssRule(
    commands,
    `.${C.Message.message} .${C.Message.timestamp}`,
    classes.messageTimestamp,
  );
  applyScopedCssRule(
    commands,
    `.${C.Message.message} .${C.Message.controlsAndText}`,
    classes.messageControlsAndText,
  );
}

features.add(import.meta.url, init, 'PROD: Adds a finish ETA label to orders.');
