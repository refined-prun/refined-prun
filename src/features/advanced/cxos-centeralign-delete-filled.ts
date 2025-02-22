import classes from './cxos-centeralign-delete-filled.module.css';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyCssRule(
    `div.${C.ActionBar.container}:has(div.${C.ActionBar.element} button.${C.Button.danger})`,
    classes.justifyContentCenter,
  );
}

features.add(import.meta.url, init, 'CXOS: Moves the delete filled button to the center');
