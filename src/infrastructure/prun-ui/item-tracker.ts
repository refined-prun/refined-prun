import tinycolor from 'tinycolor2';
import { refTextContent } from '@src/utils/reactive-dom';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { objectKeys } from 'ts-extras';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { materialCategoriesStore } from '@src/infrastructure/prun-api/data/material-categories';

export function trackItemTickers() {
  appendStylesheet();
  subscribe($$(document, C.ColoredIcon.label), label => {
    const container = label.closest(`.${C.ColoredIcon.container}`) as HTMLElement;
    if (!container) {
      return;
    }
    const currentClasses: string[] = [];
    const ticker = refTextContent(label);
    watchEffectWhileNodeAlive(label, () => {
      for (const className of currentClasses) {
        container.classList.remove(className);
      }
      currentClasses.length = 0;
      if (!ticker.value) {
        return;
      }
      currentClasses.push('rp-ticker-' + ticker.value);
      const material = materialsStore.getByTicker(ticker.value);
      const category = materialCategoriesStore.getById(material?.category);
      if (category) {
        currentClasses.push('rp-category-' + sanitizeCategoryName(category.name));
      }
      for (const className of currentClasses) {
        container.classList.add(className);
      }
    });
  });
}

function appendStylesheet() {
  const style = document.createElement('style');
  style.id = 'rp-icon-colors';
  const defaultColor = tinycolor('black');
  const gradientStart = defaultColor.darken(20).toHexString();
  const gradientEnd = defaultColor.brighten(10).toHexString();
  const fontColor = defaultColor.brighten(40).toHexString();
  const defaultStyle =
    `.rp-category- {\n` +
    `  background: linear-gradient(135deg, ${gradientStart}, ${gradientEnd});\n` +
    `  color: ${fontColor};\n` +
    '}\n\n';
  style.textContent = defaultStyle + objectKeys(categoryColors).map(createCssRule).join('\n\n');
  document.head.appendChild(style);
}

function createCssRule<T extends keyof typeof categoryColors>(category: T) {
  const color = tinycolor(categoryColors[category].color);
  const gradientStart = color.darken(20).toHexString();
  const gradientEnd = color.brighten(10).toHexString();
  const fontColor = color.brighten(40).toHexString();
  return (
    `.rp-category-${sanitizeCategoryName(category)} {\n` +
    `  background: linear-gradient(135deg, ${gradientStart}, ${gradientEnd});\n` +
    `  color: ${fontColor};\n` +
    '}'
  );
}

export function sanitizeCategoryName(name: string) {
  return name.replaceAll(' ', '-').replaceAll('(', '').replaceAll(')', '');
}

// Copied from PrUn js bundle.
const categoryColors = {
  'agricultural products': {
    color: 'b22222',
  },
  alloys: {
    color: 'cd7f32',
  },
  chemicals: {
    color: 'db7093',
  },
  'construction materials': {
    color: '6495ed',
  },
  'construction parts': {
    color: '4682b4',
  },
  'construction prefabs': {
    color: '1c39bb',
  },
  'consumables (basic)': {
    color: 'cd5c5c',
  },
  'consumables (luxury)': {
    color: 'da2c43',
  },
  drones: {
    color: 'e25822',
  },
  'electronic devices': {
    color: '8a2be2',
  },
  'electronic parts': {
    color: '9370db',
  },
  'electronic pieces': {
    color: 'b19cd9',
  },
  'electronic systems': {
    color: '663399',
  },
  elements: {
    color: '806043',
  },
  'energy systems': {
    color: '2e8b57',
  },
  fuels: {
    color: '32cd32',
  },
  gases: {
    color: '00ced1',
  },
  liquids: {
    color: 'bcd4e6',
  },
  'medical equipment': {
    color: '99cc99',
  },
  metals: {
    color: '696969',
  },
  minerals: {
    color: 'C4A484',
  },
  ores: {
    color: '838996',
  },
  plastics: {
    color: 'cb3365',
  },
  'ship engines': {
    color: 'ff4500',
  },
  'ship kits': {
    color: 'ff8c00',
  },
  'ship parts': {
    color: 'ffa500',
  },
  'ship shields': {
    color: 'ffb347',
  },
  'software components': {
    color: 'c5b358',
  },
  'software systems': {
    color: '9b870c',
  },
  'software tools': {
    color: 'daa520',
  },
  textiles: {
    color: '96a53c',
  },
  'unit prefabs': {
    color: '534b4f',
  },
  utility: {
    color: 'CEC7C1',
  },
};
