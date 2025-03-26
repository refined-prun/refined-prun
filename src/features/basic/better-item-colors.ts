import $style from './better-item-colors.module.css';
import { sanitizeCategoryName } from '@src/infrastructure/prun-ui/item-tracker';

function init() {
  applyCategoryRule('agricultural products', $style.agriculturalProducts);
  applyCategoryRule('consumables (basic)', $style.consumablesBasic);
  applyCategoryRule('consumables (luxury)', $style.consumablesLuxury);
  applyCategoryRule('fuels', $style.fuels);
  applyCategoryRule('liquids', $style.liquids);
  applyCategoryRule('plastics', $style.plastics);
  applyCategoryRule('ship shields', $style.shipShields);
}

function applyCategoryRule(category: string, rule: string) {
  applyCssRule(`.rp-category-${sanitizeCategoryName(category)}`, rule);
}

features.add(import.meta.url, init, 'Alters item colors to be more easily recognized.');
