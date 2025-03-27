import $style from './contd-upward-search-results.module.css';

function init() {
  applyCssRule('CONTD', `.${C.UserSelector.suggestionsContainer}`, $style.suggestions);
}

features.add(import.meta.url, init, 'CONTD: Moves the search bar results above the search bar.');
