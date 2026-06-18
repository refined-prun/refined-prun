import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { type MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import IntlMessageFormat from 'intl-messageformat';

export const LEAF_KEYS = ['getFormat', 'message'] as const;

export const RESERVED_KEYS = new Set(
  [
    // Javascript
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'null',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'implements',
    'interface',
    'let',
    'package',
    'private',
    'protected',
    'public',
    'static',
    'yield',
    'enum',
    'await',
    'constructor',
    // Utility
    LEAF_KEYS,
  ].flat(),
);

export type LocalizationTree = {
  [p: string]: LocalizationTree;
};

// I don't want to deal with the type argument in format just for the shortcut, so I am assuming it's a string.
// This means the return type can also be assumed to be a simple string.
// If the full format functionality is necessary, it can be accessed through imf.
export type LocalizationLeaf = LocalizationTree & {
  getFormat: () => IntlMessageFormat;
  message: typeof IntlMessageFormat.prototype.format<string>;
};

export type LiteralLocalizationLeaf = LocalizationTree & {
  getFormat: () => IntlMessageFormat;
  message: (options: void) => string;
};

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
    ? (L.Material[material?.name as keyof typeof L.Material]?.name.message() ?? material.name)
    : undefined;
}

export function getMaterialByName(name?: string | null) {
  return name ? materialsByName.get(name) : undefined;
}

type LocalizationDict = Record<string, MessageFormatElement[]>;

function addMissingLocalizationEntries(destination: LocalizationDict, source: LocalizationDict) {
  for (const key in source) {
    if (!(key in destination)) {
      destination[key] = source[key];
    }
  }
}

export function generateLocalizationTree(localizationDict: LocalizationDict): LocalizationTree {
  const tree = {} as LocalizationTree;
  for (const [key, value] of Object.entries(localizationDict)) {
    let cursor: LocalizationTree = tree;
    const pathParts = key.split('.');
    for (const pathPart of pathParts) {
      const sanitizedPathPart = sanitizeKey(pathPart);
      if (sanitizedPathPart in cursor) {
        cursor = cursor[sanitizedPathPart] as LocalizationTree;
      } else {
        cursor[sanitizedPathPart] = {};
        cursor = cursor[sanitizedPathPart];
      }
    }
    const messageFormat = new IntlMessageFormat(value);
    for (const leafKey of LEAF_KEYS) {
      switch (leafKey) {
        case 'getFormat':
          (cursor as Partial<LocalizationLeaf>)['getFormat'] = () => messageFormat;
          break;
        case 'message':
          (cursor as Partial<LocalizationLeaf>)['message'] = messageFormat.format;
          break;
      }
    }
  }
  return tree;
}

export function isLeaf(input: LocalizationTree): boolean {
  return LEAF_KEYS.every(x => x in input);
}

export function sanitizeKey(s: string): string {
  // Replace invalid chars with _
  s = s.replace(/[^a-zA-Z0-9_$]/g, '_');
  // Cannot start with number
  if (/^[0-9]/.test(s)) {
    s = '_' + s;
  }
  // Empty fallback
  if (!s) {
    s = '_';
  }
  // Avoid reserved words
  if (RESERVED_KEYS.has(s)) {
    s = `_${s}`;
  }
  return s;
}
