import classes from './item-ticker-shadow.module.css';

function init() {
  applyCssRule(`.${C.ColoredIcon.label}`, classes.shadow);
  applyCssRule(`.${C.BuildingIcon.ticker}`, classes.shadow);
}

features.add(import.meta.url, init, 'Adds a shadow to item tickers.');
