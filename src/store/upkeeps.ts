import { userData } from '@src/store/user-data';
import { createId } from '@src/store/create-id';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials.ts';

export function createUpkeep(name: string, siteId: string) {
  if (userData.upkeeps[siteId] == undefined) {
    userData.upkeeps[siteId] = [];
  }
  const id = createId();
  userData.upkeeps[siteId].push({
    id,
    siteId,
    name,
    duration: {
      millis: 1000 * 60 * 60 * 24,
    },
    matAmounts: [
      {
        material: materialsStore.getByTicker('RAT')!,
        amount: 10,
      },
    ],
  });
  return id;
}

export function deleteUpkeep(upkeep: UserData.Upkeep) {
  userData.upkeeps[upkeep.siteId] = userData.upkeeps[upkeep.siteId].filter(x => x.id != upkeep.id);
}
