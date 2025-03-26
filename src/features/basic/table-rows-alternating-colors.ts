import classes from './table-rows-alternating-colors.module.css';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyCssRule('table tbody tr:nth-child(even)', classes.evenRow);
}

features.add(import.meta.url, init, 'Colors even rows in lighter color in all tables.');
