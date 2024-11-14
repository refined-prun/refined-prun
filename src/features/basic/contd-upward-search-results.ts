import classes from './contd-upward-search-results.module.css';
import { applyScopedClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyScopedClassCssRule('CONTD', C.UserSelector.suggestionsContainer, classes.suggestions);
}

features.add(import.meta.url, init, 'CONTD: Moves the search bar results above the search bar.');
