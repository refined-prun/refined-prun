import type { ParseSelector } from 'typed-query-selector/parser';
import {
  waitElementOfHtmlCollection,
  observeHtmlCollection,
} from '@src/utils/observe-html-collection';
import { ElementTag } from '@src/infrastructure/prun-ui/tagger';
import { Observable } from '@src/utils/observable';

export function getElementByClassNameOrTag<
  Selector extends string,
  Selected extends Element = ParseSelector<Selector, HTMLElement>,
>(baseElement: Element | Document, selector: Selector) {
  const collection = getHtmlCollection<Selector, Selected>(baseElement, selector);
  return collection.length === 0 ? undefined : (collection[0] as Selected);
}

export async function waitElementByClassNameOrTag<
  Selector extends string,
  Selected extends Element = ParseSelector<Selector, HTMLElement>,
>(baseElement: Element | Document, selector: Selector) {
  const collection = getHtmlCollection<Selector, Selected>(baseElement, selector);
  return await waitElementOfHtmlCollection(baseElement, collection);
}

export function getElementsByClassNameOrTag<
  Selector extends string,
  Selected extends Element = ParseSelector<Selector, HTMLElement>,
>(baseElement: Element | Document, selector: Selector) {
  const collection = getHtmlCollection<Selector, Selected>(baseElement, selector);
  return Array.from(collection) as Selected[];
}

export function observeElementsByClassNameOrTag<
  Selector extends string,
  Selected extends Element = ParseSelector<Selector, HTMLElement>,
>(baseElement: Element | Document, selector: Selector): Observable<Selected> {
  const collection = getHtmlCollection<Selector, Selected>(baseElement, selector);
  return observeHtmlCollection(baseElement, collection);
}

const tagNames = new Set<string>([
  'div',
  'input',
  'span',
  'table',
  'thead',
  'tbody',
  'td',
  'tr',
  'th',
  'button',
  'progress',
  'style',
  'option',
  'select',
]);
const classNames = new Set<string>([
  'rc-slider',
  'rc-slider-disabled',
  'rc-slider-rail',
  'rc-slider-track',
  'rc-slider-step',
  'rc-slider-dot',
  'rc-slider-dot-active',
  'rc-slider-mark',
  'rc-slider-mark-text-active',
  'rc-slider-handle',
  'rc-slider-mark-text',
  ...Object.values(ElementTag),
]);

export function registerClassName(className: string) {
  classNames.add(className);
}

function getHtmlCollection<
  Selector extends string,
  Selected extends Element = ParseSelector<Selector, HTMLElement>,
>(baseElement: Element | Document, selector: Selector) {
  if (classNames.has(selector)) {
    return baseElement.getElementsByClassName(selector) as HTMLCollectionOf<Selected>;
  }
  if (tagNames.has(selector)) {
    return baseElement.getElementsByTagName(selector) as HTMLCollectionOf<Selected>;
  }
  if (isValidTag(selector)) {
    tagNames.add(selector);
  } else {
    classNames.add(selector);
  }
  return getHtmlCollection(baseElement, selector);
}

function isValidTag(name: string) {
  try {
    return document.createElement(name).constructor.name !== 'HTMLUnknownElement';
  } catch {
    return false;
  }
}

export const $ = waitElementByClassNameOrTag;
export const _$ = getElementByClassNameOrTag;
export const $$ = observeElementsByClassNameOrTag;
export const _$$ = getElementsByClassNameOrTag;
