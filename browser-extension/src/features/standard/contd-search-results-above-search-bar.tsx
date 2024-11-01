import classes from './contd-search-results-above-search-bar.module.css';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { applyScopedClassCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

export function init() {
  applyScopedClassCssRule('CONTD', PrunCss.UserSelector.suggestionsContainer, classes.suggestions);
}

void features.add({
  id: 'contd-search-results-above-search-bar',
  description: 'CONTD: Moves the search bar results above the search bar.',
  init,
});
