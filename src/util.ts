/* eslint-disable @typescript-eslint/no-explicit-any */
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { getStarNaturalId, starsStore } from '@src/infrastructure/prun-api/data/stars';
import { Stations, Selector, Style } from '@src/legacy';
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

// Create an option element for a select list
export function createSelectOption(optionLabel, optionValue, rightAlign?) {
  const option = document.createElement('option');
  option.value = optionValue;
  option.textContent = optionLabel;
  if (rightAlign) {
    option.style.direction = 'rtl';
  }
  return option;
}

/**
 * Create a span with the given text
 * @param text
 * @param className
 * @returns {HTMLSpanElement}
 */
export function createTextSpan(text, className: string = 'prun-remove-js') {
  const newSpan = document.createElement('span');
  newSpan.classList.add(className);
  newSpan.textContent = text;
  return newSpan;
}

// Remove all the children of a given element
export function clearChildren(elem) {
  elem.textContent = '';
  while (elem.children[0]) {
    elem.removeChild(elem.children[0]);
  }
  return;
}

export function changeInputValue(input: HTMLInputElement, value: string) {
  // React overrides the native property, so we can't use it directly.
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
  setter!.set!.call(input, value);
  const event = new Event('input', { bubbles: true, cancelable: true });
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

// Return all matching buffers
export function getBuffers(bufferCode: string): HTMLElement[] {
  const nodes = document.evaluate(
    `//div[@class='${Selector.BufferHeaderClass}'][starts-with(translate(., 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), '${bufferCode}')]/../..`,
    document,
    null,
    XPathResult.ANY_TYPE,
    null,
  );
  const buffers = [];
  let node;

  while ((node = nodes.iterateNext())) {
    buffers.push(node as never);
  }
  return buffers;
}

// Return all matching buffers from prefound buffer list
export function getBuffersFromList(bufferCode: string, buffers: any[]): any[] {
  return buffers
    .filter(([firstElement]) => firstElement.toLowerCase().startsWith(bufferCode.toLowerCase()))
    .map(([, secondElement]) => secondElement);
}

// Create a success dialog with a dismiss button
export function showSuccessDialog(tile, message: string = 'Action succeeded!') {
  const displayTile = tile.parentElement.parentElement.parentElement;

  const overlay = document.createElement('div'); // Main striped overlay
  displayTile.appendChild(overlay);
  overlay.classList.add(...Style.ActionSuccess);

  const centerInterface = document.createElement('span'); // Center green block with message
  overlay.appendChild(centerInterface);
  centerInterface.classList.add(...Style.ActionMessage);
  centerInterface.textContent = message;

  const dismissMessage = document.createElement('span'); // Dismiss message
  centerInterface.appendChild(dismissMessage);
  dismissMessage.textContent = '(click to dismiss)';
  dismissMessage.classList.add(...Style.ActionDismiss);

  overlay.addEventListener('click', () => {
    // Just remove the overlay to dismiss
    displayTile.removeChild(overlay);
    return;
  });

  return;
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
