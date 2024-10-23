import classes from './table-rows-alternating-colors.module.css';
import highlight from '@src/infrastructure/prun-ui/table-row-highlight.module.css';
import features from '@src/feature-registry';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

export function init() {
  applyCssRule('table tbody tr:nth-child(odd) td:nth-child(even)', classes.evenCell);
  applyCssRule('table tbody tr:nth-child(odd) td:nth-child(odd)', classes.oddCell);
  applyCssRule('table tbody tr:nth-child(odd):hover td', classes.hover);
  applyCssRule(`table tbody tr.${highlight.highlight}:nth-child(odd) td`, classes.hover);
}

void features.add({
  id: 'table-rows-alternating-colors',
  init,
});