import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import classes from './missing-input-background.module.css';

function init() {
  applyScopedCssRule(
    'PROD',
    `.${C.OrderSlot.container}:has(.${C.OrderStatus.error})`,
    classes.inputMissingContainer,
  );
  applyScopedCssRule('PRODQ', `tr:has(.${C.OrderStatus.error})`, classes.inputMissingContainer);
  applyScopedCssRule('PRODQ', `tr:has(.${C.OrderStatus.error}) td`, classes.queueData);
  applyScopedCssRule('PRODQ', `tr:has(.${C.OrderStatus.error}):hover td`, classes.queueDataHover);
  applyScopedCssRule(
    'PRODCO',
    `.${C.InputsOutputsView.input}:has(.${C.InputsOutputsView.amountMissing})`,
    classes.inputMissingContainer,
  );
}

features.add(import.meta.url, init, 'Missing input labels get a red background coloring');
