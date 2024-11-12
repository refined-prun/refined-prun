import classes from './table-rows-alternating-colors.module.css';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyCssRule('table tbody tr:nth-child(even) td', classes.cell);
  applyCssRule('table tbody tr:nth-child(even) td:before', classes.overlay);
}

features.add({
  id: 'table-rows-alternating-colors',
  description: 'Colors even rows in lighter color in all tables.',
  init,
});
