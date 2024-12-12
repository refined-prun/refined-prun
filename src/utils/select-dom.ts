import type { ParseSelector } from 'typed-query-selector/parser';
import {
  streamElementOfHtmlCollection,
  streamHtmlCollection,
} from '@src/utils/stream-html-collection';

export function getElementByClassNameOrTag<
  Selector extends string,
  Selected extends Element = ParseSelector<Selector, HTMLElement>,
>(baseElement: Element | Document, selector: Selector) {
  const collection = getHtmlCollection<Selector, Selected>(baseElement, selector);
  return collection.length === 0 ? undefined : (collection[0] as Selected);
}

export async function streamElementByClassNameOrTag<
  Selector extends string,
  Selected extends Element = ParseSelector<Selector, HTMLElement>,
>(baseElement: Element | Document, selector: Selector) {
  const collection = getHtmlCollection<Selector, Selected>(baseElement, selector);
  return await streamElementOfHtmlCollection(baseElement, collection);
}

export function getElementsByClassNameOrTag<
  Selector extends string,
  Selected extends Element = ParseSelector<Selector, HTMLElement>,
>(baseElement: Element | Document, selector: Selector) {
  const collection = getHtmlCollection<Selector, Selected>(baseElement, selector);
  return Array.from(collection) as Selected[];
}

export function streamElementsByClassNameOrTag<
  Selector extends string,
  Selected extends Element = ParseSelector<Selector, HTMLElement>,
>(
  baseElement: Element | Document,
  selector: Selector,
): Iterable<Selected> & AsyncIterable<Selected> {
  const collection = getHtmlCollection<Selector, Selected>(baseElement, selector);
  return {
    [Symbol.iterator]() {
      return Array.from(collection)[Symbol.iterator]();
    },
    [Symbol.asyncIterator]() {
      return streamHtmlCollection(baseElement, collection);
    },
  };
}

const tagNames = new Set<string>([
  'div',
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
]);
const classNames = new Set<string>(['rc-slider-handle']);

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

export const $ = streamElementByClassNameOrTag;
export const _$ = getElementByClassNameOrTag;
export const $$ = streamElementsByClassNameOrTag;
export const _$$ = getElementsByClassNameOrTag;
