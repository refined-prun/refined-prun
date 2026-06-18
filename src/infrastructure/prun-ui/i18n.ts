import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { LiteralElement, type MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import IntlMessageFormat from 'intl-messageformat';

export const LEAF_KEYS = ['getFormat'] as const;

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

export function generateLocalizationTree(localizationDict: LocalizationDict): LocalizationTree {
  const tree = {} as LocalizationTree;
  for (const [key, value] of Object.entries(localizationDict)) {
    let parent = tree;
    let cursor: LocalizationTree = tree;
    const pathParts = key.split('.');
    for (const pathPart of pathParts) {
      const sanitizedPathPart = sanitizeKey(pathPart);
      parent = cursor;
      if (sanitizedPathPart in cursor) {
        cursor = cursor[sanitizedPathPart] as LocalizationTree;
      } else {
        cursor[sanitizedPathPart] = {};
        cursor = cursor[sanitizedPathPart];
      }
    }
    const messageFormat = new IntlMessageFormat(value);
    const format = values => messageFormat.format(values);
    (cursor as Partial<LocalizationLeaf>).getFormat = () => messageFormat;
    parent[sanitizeKey(pathParts[pathParts.length - 1])] = Object.assign(format, cursor);
  }
  return tree;
}

export function isLeaf(input: LocalizationTree): boolean {
  const a = L.StoreTypeLabel['asd'];
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
