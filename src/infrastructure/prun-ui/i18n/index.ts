import { TYPE } from '@formatjs/icu-messageformat-parser';
import { addMissingLocalizationEntries, generateLocalizationTree } from './localization-tree';
import { createLocalizationProxy } from './localization-proxy';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import Cookies from 'js-cookie';

export const prunLocale = (Cookies.get('pu-locale') ?? 'en') as
  | 'en'
  | 'de'
  | 'ca'
  | 'zh_CN'
  | 'nl'
  | 'fi'
  | 'fr'
  | 'it'
  | 'ja'
  | 'ko'
  | 'pt_BR'
  | 'ru'
  | 'es'
  | 'uk';

export let L!: PrunLocalization;
export let localizationTree!: LocalizationTree;

export function loadPrunI18N() {
  const i18n = window['PrUn_i18n'];
  const fallback = window['PrUn_i18n_en'];
  if (fallback) {
    addMissingLocalizationEntries(i18n, fallback);
  }
  localizationTree = generateLocalizationTree(i18n);
  L = createLocalizationProxy(localizationTree, 'L') as unknown as PrunLocalization;
  loadMaterialNameMap();
}

const materialsByName = new Map<string, PrunApi.Material>();

export function loadMaterialNameMap() {
  for (const material of materialsStore.all.value!) {
    const name = getMaterialName(material);
    if (name) {
      materialsByName.set(name, material);
    }
  }
}

export function getMaterialName(material?: PrunApi.Material | null) {
  return material
    ? (lookupLocalization(L.Material, material.name).name() ?? material.name)
    : undefined;
}

export function getMaterialByName(name?: string | null) {
  return name ? materialsByName.get(name) : undefined;
}

export function applyLocalizationPatch(
  localization: LiteralLocalizationLeaf,
  patch:
    | ((value: string) => string)
    | Partial<Record<typeof prunLocale | 'default', (value: string) => string>>,
) {
  const ast = localization.getFormat()?.getAst();
  const text = localization();
  if (ast === undefined || text === undefined) {
    return;
  }
  const applyPatch: ((value: string) => string) | undefined =
    typeof patch === 'function' ? patch : (patch[prunLocale] ?? patch['default']);
  if (applyPatch === undefined) {
    return;
  }
  const newText = applyPatch(text);
  ast.length = 1;
  ast[0] = { type: TYPE.literal, value: newText };
}

// Indexes a localization subtree with a runtime key, returning the child leaf or subtree.
// Use instead of `node[key as keyof typeof node]` for dynamic keys. The L proxy resolves a
// missing key to `undefined` at the terminal call, so the result stays safe to invoke.
export function lookupLocalization<T>(node: T, key: string): T[keyof T] {
  return (node as Record<string, unknown>)[key] as T[keyof T];
}
