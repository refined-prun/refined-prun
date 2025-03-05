import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import classes from './production-order-error-highlight.module.css';

function init() {
  applyScopedCssRule(
    'PROD',
    `.${C.OrderSlot.container}:has(.${C.OrderStatus.error})`,
    classes.inputMissingContainer,
  );
  applyScopedCssRule('PRODQ', `tr:has(.${C.OrderStatus.error})`, classes.orderRow);
  applyScopedCssRule('PRODQ', `tr:has(.${C.OrderStatus.error}):after`, classes.orderRowOverlay);
  applyScopedCssRule(
    'PRODCO',
    `.${C.InputsOutputsView.input}:has(.${C.InputsOutputsView.amountMissing})`,
    classes.inputMissingContainer,
  );
}

features.add(
  import.meta.url,
  init,
  'Highlights production orders with errors in PROD, PRODQ, and PRODCO.',
);
