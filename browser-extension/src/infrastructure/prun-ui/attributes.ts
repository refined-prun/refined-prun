import { refAttributeValue } from '@src/utils/reactive-dom';

export function getPrunId(element: HTMLElement) {
  return element.getAttribute('data-prun-id');
}

export function refPrunId(element: HTMLElement) {
  return refAttributeValue(element, 'data-prun-id');
}
