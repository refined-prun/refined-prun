import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { getStarNaturalId, starsStore } from '@src/infrastructure/prun-api/data/stars';
import { Stations } from '@src/legacy';
import { getMaterialName } from '@src/infrastructure/prun-ui/i18n';
import { sleep } from './utils/sleep';

// Download a file containing fileData with fileName
export function downloadFile(fileData, fileName, isJSON: boolean = true) {
  const blob = new Blob([isJSON ? JSON.stringify(fileData) : fileData], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const urlElement = document.createElement('a');
  urlElement.setAttribute('download', fileName);
  urlElement.href = url;
  urlElement.setAttribute('target', '_blank');
  urlElement.click();
  URL.revokeObjectURL(url);
  return;
}

export function changeInputValue(input: HTMLInputElement, value: string) {
  // React overrides the native property, so we can't use it directly.
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
  setter!.set!.call(input, value);
  const event = new InputEvent('input', { bubbles: true, cancelable: true });
  input.dispatchEvent(event);
  const changeEvent = new Event('change', { bubbles: true, cancelable: true });
  input.dispatchEvent(changeEvent);
}

export function changeSelectIndex(input, selectIndex) {
  // React overrides the native property, so we can't use it directly.
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLSelectElement.prototype,
    'selectedIndex',
  );
  setter!.set!.call(input, selectIndex);
  const changeEvent = new Event('change', { bubbles: true, cancelable: true });
  input.dispatchEvent(changeEvent);
}

export function focusElement(input: HTMLElement) {
  const event = new FocusEvent('focusin', { bubbles: true, cancelable: false });
  input.dispatchEvent(event);
}

// A function to compare two planets (to be used in .sort() functions)
export function comparePlanets(idOrNameA: string, idOrNameB: string) {
  const planetA = planetsStore.find(idOrNameA);
  const planetB = planetsStore.find(idOrNameB);
  if (planetA === planetB) {
    return 0;
  }
  if (!planetA) {
    return 1;
  }
  if (!planetB) {
    return -1;
  }

  const systemA = starsStore.getByPlanetNaturalId(planetA.naturalId);
  const systemB = starsStore.getByPlanetNaturalId(planetB.naturalId);
  if (!systemA) {
    return 1;
  }
  if (!systemB) {
    return -1;
  }

  if (systemA !== systemB) {
    const naturalIdA = getStarNaturalId(systemA);
    const naturalIdB = getStarNaturalId(systemB);
    const isSystemANamed = systemA.name !== naturalIdA;
    const isSystemBNamed = systemB.name !== naturalIdB;

    if (isSystemANamed && !isSystemBNamed) {
      return -1;
    }
    if (isSystemBNamed && !isSystemANamed) {
      return 1;
    }
    if (isSystemANamed && isSystemBNamed) {
      return systemA.name > systemB.name ? 1 : -1;
    }
    return naturalIdA > naturalIdB ? 1 : -1;
  }

  const isPlanetANamed = planetA.name !== planetA.naturalId;
  const isPlanetBNamed = planetB.name !== planetB.naturalId;

  if (isPlanetANamed && !isPlanetBNamed) {
    return -1;
  }
  if (isPlanetANamed && !isPlanetBNamed) {
    return 1;
  }

  return isPlanetANamed && isPlanetBNamed
    ? planetA.name > planetB.name
      ? 1
      : -1
    : planetA.naturalId > planetB.naturalId
      ? 1
      : -1;
}

export function extractPlanetName(text: string | null) {
  if (!text) {
    return text;
  }
  text = text
    // Clear parenthesis
    .replace(/\s*\([^)]*\)/, '')
    // Clear space between system and planet
    .replace(/(\d)\s+(?=[a-zA-Z])/, '$1')
    // Clear system name in named systems
    .replace(/.*\s-\s/, '');
  return (Stations[text] ?? text) as string;
}

export function getMaterialNameByTicker(ticker?: string | null) {
  const material = materialsStore.getByTicker(ticker);
  return getMaterialName(material);
}

export async function clickElement(element?: HTMLElement | null) {
  if (!element) {
    return;
  }

  element.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  element.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  await sleep(0);

  element.dispatchEvent(
    new PointerEvent('pointerup', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  element.dispatchEvent(
    new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  element.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );
}

export function mouseOverElement(from: HTMLElement, to: HTMLElement) {
  const mouseEvent = new MouseEvent('mouseout', {
    bubbles: true,
    cancelable: true,
    relatedTarget: to,
    view: window,
  });
  from.dispatchEvent(mouseEvent);
}
