import { MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import IntlMessageFormat from 'intl-messageformat';
import { clearSanitizeCache, sanitizeKey } from './sanitize-key';

type LocalizationDict = Record<string, MessageFormatElement[]>;

export function addMissingLocalizationEntries(
  destination: LocalizationDict,
  source: LocalizationDict,
) {
  for (const key in source) {
    if (!(key in destination)) {
      destination[key] = source[key];
    }
  }
}

export function generateLocalizationTree(localization: LocalizationDict) {
  const tree = {} as LocalizationTree;
  for (const key in localization) {
    const value = localization[key];
    let parent = tree;
    let cursor = tree;
    let cursorKey = '';
    let start = 0;
    while (true) {
      const dot = key.indexOf('.', start);
      cursorKey = sanitizeKey(key.slice(start, dot === -1 ? undefined : dot));
      parent = cursor;
      cursor = (cursor[cursorKey] ??= {}) as LocalizationTree;
      if (dot === -1) {
        break;
      }
      start = dot + 1;
    }
    parent[cursorKey] = createLocalizationLeaf(value, cursor);
  }
  clearSanitizeCache();
  return tree;
}

function createLocalizationLeaf(value: MessageFormatElement[], children: LocalizationTree) {
  let messageFormat: IntlMessageFormat;
  const getFormat = () => (messageFormat ??= new IntlMessageFormat(value));
  const format: typeof IntlMessageFormat.prototype.format<string> = values =>
    getFormat().format(values);
  return Object.assign(format, children, { getFormat }) as LocalizationLeaf;
}
