import { watchUntil } from '@src/utils/watch';
import { sectorsStore } from '@src/infrastructure/prun-api/data/sectors';
import {
  canDispatchClientPrunMessage,
  dispatchClientPrunMessage,
} from '@src/infrastructure/prun-api/prun-api-listener';
import { WORLD_SECTORS } from '@src/infrastructure/prun-api/client-messages';

const fixedNames = new Map<string, string>([
  ['sector-4', 'LS'],
  ['sector-30', 'OY'],
  ['sector-35', 'AM'],
  ['sector-61', 'BS'],
  ['sector-73', 'IZ'],
  ['sector-79', 'LG'],
  ['sector-103', 'OS'],
]);

async function patchSectorNames() {
  await watchUntil(
    () => sectorsStore.all.value !== undefined && canDispatchClientPrunMessage.value,
  );
  const sectors = sectorsStore.all.value!;
  for (const sector of sectors) {
    const fixedName = fixedNames.get(sector.id);
    if (fixedName) {
      sector.name = fixedName;
    }
  }
  const messsage = WORLD_SECTORS(sectors);
  dispatchClientPrunMessage(messsage);
}

function init() {
  void patchSectorNames();
}

features.add(import.meta.url, init, 'MU: Fixes sector names, for example LE => LS.');
