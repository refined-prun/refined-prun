import { addMissingLocalizationEntries, generateLocalizationTree } from './localization-tree';
import { createLocalizationProxy } from './localization-proxy';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import Cookies from 'js-cookie';
import {
  emitStatic,
  extractFormatOptions,
} from '@src/infrastructure/prun-ui/i18n/localization-type-generator';
import IntlMessageFormat from 'intl-messageformat';

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

// Replace a localization by providing a patch function.
// The patch function provides the original ICU message as an argument.
// See https://formatjs.github.io/docs/core-concepts/icu-syntax for syntax.
// When replacing a localization, the new format MUST NOT have new options, but may have fewer.
// Please note that the following localizations are bugged and are missing their options
// by default. Fixed in prun-bugs.ts:
// L.GroupChannelMembershipPanel.title
// L.PublicChannelMembershipPanel.title.default
// L.Warehouse.error.id
// L.chat.messages.renamed
// L.chat.messages.renamed.auto
// The 'force' parameter is for these cases specifically and should otherwise not be used.
export function applyLocalizationPatch<T extends Record<string, unknown> | undefined>(
  localization: ParametrizedLocalizationLeaf<T>,
  patch:
    | ((value: string) => string)
    | Partial<Record<typeof prunLocale | 'default', (value: string) => string>>,
  force: boolean = false,
) {
  const ast = localization.getFormat()?.getAst();
  if (ast === undefined) {
    return;
  }
  const initialOptions = extractFormatOptions(ast);
  const text = emitStatic(ast);
  const applyPatch: ((value: string) => string) | undefined =
    typeof patch === 'function' ? patch : (patch[prunLocale] ?? patch['default']);
  if (applyPatch === undefined) {
    return;
  }
  const newText = applyPatch(text);
  const newAst = new IntlMessageFormat(newText).getAst();
  const resultOptions = extractFormatOptions(newAst);
  for (const [option, values] of resultOptions.entries()) {
    const initialValues = initialOptions.get(option);
    if (!force && !initialValues) {
      console.error(
        `Failed to patch localization ${text}: option ${option} does not exist for the initial localization.`,
      );
      return;
    }
    if (
      !force &&
      initialValues &&
      (values.length < initialValues.length || !initialValues.every(x => values.includes(x)))
    ) {
      console.error(
        `Failed to patch localization ${text}: new signature of option ${option} (${JSON.stringify(values)}) does not match initial signature (${JSON.stringify(initialValues)})`,
      );
      return;
    }
  }
  ast.splice(0, ast.length, ...newAst);
}

// Indexes a localization subtree with a runtime key, returning the child leaf or subtree.
// Use instead of `node[key as keyof typeof node]` for dynamic keys. The L proxy resolves a
// missing key to `undefined` at the terminal call, so the result stays safe to invoke.
export function lookupLocalization<T>(node: T, key: string): T[keyof T] {
  return (node as Record<string, unknown>)[key] as T[keyof T];
}
