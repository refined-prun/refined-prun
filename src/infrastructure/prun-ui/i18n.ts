import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { type MessageFormatElement, type LiteralElement } from '@formatjs/icu-messageformat-parser';
import {
  emitLocalizationFile,
  generateLocalizationTree,
  LocalizationTree,
} from '@src/infrastructure/prun-ui/localization-type-generator';

export let L!: PrunLocalization;

export let PrunI18N: Record<string, MessageFormatElement[]> = {};

const materialsByName = new Map<string, PrunApi.Material>();

export function loadPrunI18N() {
  PrunI18N = window['PrUn_i18n'];
  L = generateLocalizationTree(PrunI18N) as unknown as PrunLocalization;
  // Below code is for type generation.
  // const localizationFile = emitLocalizationFile(L as unknown as LocalizationTree);
  // console.log(localizationFile);
  for (const material of materialsStore.all.value!) {
    const name = getMaterialName(material);
    if (name) {
      materialsByName.set(name, material);
    }
  }
}

export function getMaterialName(material?: PrunApi.Material | null) {
  return material
    ? (PrunI18N[`Material.${material?.name}.name`]?.[0] as LiteralElement | undefined)?.value
    : undefined;
}

export function getMaterialByName(name?: string | null) {
  return name ? materialsByName.get(name) : undefined;
}
