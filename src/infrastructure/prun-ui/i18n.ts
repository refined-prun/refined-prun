import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { LiteralElement, type MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import IntlMessageFormat from 'intl-messageformat';

export const LEAF_KEYS = ['getFormat'] as const;

export const RESERVED_KEYS = new Set(
  [
    // Javascript
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#reserved_words
    'abstract',
    'await',
    'boolean',
    'break',
    'byte',
    'case',
    'catch',
    'char',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'double',
    'else',
    'enum',
    'export',
    'extends',
    'false',
    'final',
    'finally',
    'float',
    'for',
    'function',
    'goto',
    'if',
    'implements',
    'import',
    'in',
    'instanceof',
    'int',
    'interface',
    'let',
    'long',
    'native',
    'new',
    'null',
    'package',
    'private',
    'protected',
    'public',
    'return',
    'short',
    'static',
    'super',
    'switch',
    'synchronized',
    'this',
    'throw',
    'transient',
    'true',
    'try',
    'typeof',
    'var',
    'void',
    'volatile',
    'while',
    'with',
    'yield',
    // Utility
    LEAF_KEYS,
  ].flat(),
);

export let L!: PrunLocalization;

const materialsByName = new Map<string, PrunApi.Material>();

export function loadPrunI18N() {
  const i18n = window['PrUn_i18n'];
  const i18nEN = window['PrUn_i18n_en'];
  addMissingLocalizationEntries(i18n, i18nEN);
  L = generateLocalizationTree(i18n) as unknown as PrunLocalization;
  for (const material of materialsStore.all.value!) {
    const name = getMaterialName(material);
    if (name) {
      materialsByName.set(name, material);
    }
  }
}

export function getMaterialName(material?: PrunApi.Material | null) {
  return material
    ? (L.Material[material?.name as keyof typeof L.Material]?.name() ?? material.name)
    : undefined;
}

export function getMaterialByName(name?: string | null) {
  return name ? materialsByName.get(name) : undefined;
}

export function applyLocalizationPatch(
  localization: LiteralLocalizationLeaf,
  patch: (value: string) => string,
) {
  const localized = localization.getFormat().getAst()[0] as LiteralElement | undefined;
  if (!localized) {
    return;
  }
  localized.value = patch(localized.value);
}

type LocalizationDict = Record<string, MessageFormatElement[]>;

function addMissingLocalizationEntries(destination: LocalizationDict, source: LocalizationDict) {
  for (const key in source) {
    if (!(key in destination)) {
      destination[key] = source[key];
    }
  }
}

export function generateLocalizationTree(localizationDict: LocalizationDict) {
  const tree = {} as LocalizationTree;
  for (const key in localizationDict) {
    const value = localizationDict[key];
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
  sanitizeCache.clear();
  return tree;
}

function createLocalizationLeaf(value: MessageFormatElement[], children: LocalizationTree) {
  let messageFormat: IntlMessageFormat;
  const getFormat = () => (messageFormat ??= new IntlMessageFormat(value));
  const format = values => getFormat().format(values);
  return Object.assign(format, children, { getFormat });
}

export function isLeaf(input: LocalizationTree): boolean {
  return LEAF_KEYS.every(x => x in input);
}

const sanitizeCache = new Map<string, string>();

function sanitizeKey(key: string): string {
  const cached = sanitizeCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  let s = key;
  // Replace invalid chars with _
  s = s.replace(/[^a-zA-Z0-9_$]/g, '_');
  // Empty fallback
  if (!s) {
    s = '_';
  }
  // Cannot start with number
  else if (isDigit(s.charCodeAt(0))) {
    s = '_' + s;
  }
  // Avoid reserved words
  else if (RESERVED_KEYS.has(s)) {
    s = `_${s}`;
  }

  sanitizeCache.set(key, s);
  return s;
}

function isDigit(c: number) {
  return c >= 48 && c <= 57;
}
