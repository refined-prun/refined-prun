<script setup lang="ts">
import { TileModifier } from './tile-modifier';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import {
  getEntityFullNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import PrunButton from '@src/components/PrunButton.vue';
import Active from '@src/components/forms/Active.vue';
import Commands from '@src/components/forms/Commands.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';

const bases = computed(() =>
  (sitesStore.all.value ?? [])
    .map(site => ({
      label: getEntityFullNameFromAddress(site.address) ?? site.siteId,
      value: site.siteId,
    }))
    .sort((a, b) => a.label.localeCompare(b.label)),
);
const base = ref(bases[0]);
const hasTilesToUpdate = ref(false);
const observerRegistered = ref(false);

// Function to get the first tile that needs to be updated
function getTileToUpdate(): PrunTile | undefined {
  if (!base.value) {
    return undefined;
  }

  const site = sitesStore.getById(base.value);
  if (!site) {
    return undefined;
  }

  // Check active tiles
  for (const tile of tiles.getActiveTiles()) {
    const newCommand = getNewCommand(tile, site);
    if (newCommand && tile.fullCommand.toUpperCase() !== newCommand.toUpperCase()) {
      return tile;
    }
  }

  return undefined;
}

// Function to check if there are tiles that need to be updated
function checkTilesToUpdate() {
  const tileToUpdate = getTileToUpdate();
  hasTilesToUpdate.value = tileToUpdate !== undefined;
}

// Watch for changes in base selection
watch(base, () => {
  checkTilesToUpdate();
});

// Register observer on mount
onMounted(() => {
  if (observerRegistered.value) {
    return;
  }

  tiles.observeAll((tile: PrunTile) => {
    if (base.value === undefined) {
      return;
    }

    // If we added a new tile, check if it needs to be updated.
    const site = sitesStore.getById(base.value)!;
    const newCommand = getNewCommand(tile, site);
    if (newCommand && tile.fullCommand.toUpperCase() !== newCommand.toUpperCase()) {
      hasTilesToUpdate.value = true;
    }

    // If the flag is true, check if we need to update the tiles.
    if (hasTilesToUpdate.value) {
      checkTilesToUpdate();
    }
  });
  observerRegistered.value = true;
});

function onLoadClick() {
  const tileToUpdate = getTileToUpdate();
  if (!tileToUpdate) {
    return;
  }

  const site = sitesStore.getById(base.value)!;
  const modifier = new TileModifier(tileToUpdate);
  const newCommand = getNewCommand(tileToUpdate, site);
  modifier.changeCommand(newCommand!);
}

function getNewCommand(tile: PrunTile, site: PrunApi.Site) {
  let newCommand: string | undefined = undefined;
  // Check if command that accepts base
  switch (tile.command.toUpperCase()) {
    case 'BS': // BS (planet id)
      if (tile.parameter === undefined) {
        return undefined;
      }
      newCommand = getNewPlanetCommand(tile, site);
      break;

    case 'BSC': // BSC (planet id)
    case 'COGC': // BSC (planet id)
    case 'COGCPEX': // COGCPEX (planet id)
    case 'COGCU': // COGCU (planet id)
    case 'GOV': // GOV (planet id)
    case 'LM': // LM (planet id)
    case 'LMP': // LMP (planet id)
    case 'LR': // LR (planet id)
    case 'PLI': // PLI (planet id)
    case 'PLNM': // PLNM (planet id)
    case 'POPI': // POPI (planet id)
    case 'POPR': // POPR (planet id)
    case 'PPS': // PPS (planet id)
      newCommand = getNewPlanetCommand(tile, site);
      break;

    case 'PROD': // PROD (site id)
    case 'WF': // WF (site id)
    case 'EXP': // EXP (site id)
      newCommand = getNewSiteCommand(tile, site);
      break;

    case 'INV': // INV (store id)
      newCommand = getNewStoreCommand(tile, site);
      break;

    case 'BBC': // BBC (base id)
    case 'BBL': // BBL (base id)
      newCommand = getNewBaseCommand(tile, base.value);
      break;

    case 'XIT':
      newCommand = getNewXitCommand(tile, site);
      break;

    case 'COMG': // COMG pl-(planet id)
      newCommand = getNewPlanetPrefixCommand(tile, site);
      break;

    //case "COGCPD": // COGCPD p-(planet id) pn-(program)
    //case "POPID": // POPID p-(planet id) t-(infrastructure type)
    //case "PP": // PP p-(planet id) pp-(project type)
    // TODO
    //break;

    //case "INF": // INF (system id)
    //case "MS": // MS (system id)
    // TODO
    //break;

    default:
      break;
  }
  return newCommand;
}

function getNewStoreCommand(tile: PrunTile, site: PrunApi.Site): string | undefined {
  const stores = storagesStore.getByAddressableId(site.siteId) ?? [];
  if (stores.length === 0) {
    return undefined;
  }
  const store = stores[0];
  return `${tile.command} ${store.id}`;
}

function getNewXitCommand(tile: PrunTile, site: PrunApi.Site): string | undefined {
  const parameters = tile.parameter?.split(' ') ?? [];
  const subcommand = parameters[0];
  const address = getEntityNaturalIdFromAddress(site.address);
  // XIT BURN without a planet is ignored.
  if (subcommand == 'BURN' && parameters.length === 1) {
    return undefined;
  }
  switch (subcommand) {
    case 'BURN': // XIT BURN (planet id)
    case 'CHAT': // XIT CHAT (planet id)
    case 'REP': // XIT REP (planet id)
      if (parameters.length > 1) {
        return `${tile.command} ${subcommand} ${address}`;
      }
      break;
    default:
      break;
  }
  return undefined;
}

function getNewPlanetPrefixCommand(tile: PrunTile, site: PrunApi.Site): string | undefined {
  const parameters = tile.parameter?.split(' ') ?? [];
  const subcommand = parameters[0];
  if (subcommand?.startsWith('pl-')) {
    const address = getEntityNaturalIdFromAddress(site.address);
    return `${tile.command} pl-${address}`;
  }
  return undefined;
}

function getNewPlanetCommand(tile: PrunTile, site: PrunApi.Site): string | undefined {
  const address = getEntityNaturalIdFromAddress(site.address);
  return `${tile.command} ${address}`;
}

function getNewSiteCommand(
  tile: PrunTile,
  site: PrunApi.Site,
  fullId: boolean = false,
): string | undefined {
  return `${tile.command} ${fullId ? site.siteId : site.siteId.substring(0, 8)}`;
}

function getNewBaseCommand(tile: PrunTile, base: string): string | undefined {
  return `${tile.command} ${base}`;
}
</script>

<template>
  <Active label="Base">
    <SelectInput v-model="base" :options="bases" />
  </Active>
  <Commands>
    <PrunButton primary :disabled="!hasTilesToUpdate" @click="onLoadClick">LOAD</PrunButton>
  </Commands>
</template>

<style module></style>
