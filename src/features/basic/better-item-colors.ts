import classes from './better-item-colors.module.css';
import { sanitizeCategoryName } from '@src/infrastructure/prun-ui/item-tracker';

function init() {
  applyCategoryRule('agricultural products', classes.agriculturalProducts);
  applyCategoryRule('consumables (basic)', classes.consumablesBasic);
  applyCategoryRule('consumables (luxury)', classes.consumablesLuxury);
  applyCategoryRule('fuels', classes.fuels);
  applyCategoryRule('liquids', classes.liquids);
  applyCategoryRule('plastics', classes.plastics);
  applyCategoryRule('ship shields', classes.shipShields);
}

function applyCategoryRule(category: string, rule: string) {
  applyCssRule(`.rp-category-${sanitizeCategoryName(category)}`, rule);
}

features.add(import.meta.url, init, 'Alters item colors to be more easily recognized.');
