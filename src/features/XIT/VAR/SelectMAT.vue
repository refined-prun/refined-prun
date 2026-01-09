<script setup lang="ts">
import { TileModifier } from './tile-modifier';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { sortMaterials } from '@src/core/sort-materials';
import { getMaterialName } from '@src/infrastructure/prun-ui/i18n';
import PrunButton from '@src/components/PrunButton.vue';
import Active from '@src/components/forms/Active.vue';
import Commands from '@src/components/forms/Commands.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';

const materials = computed(() =>
  sortMaterials(materialsStore.all.value ?? [])
    .map(material => ({
      label: material.ticker + ': ' + getMaterialName(material),
      value: material.ticker,
    }))
    .sort((a, b) => a.label.localeCompare(b.label)),
);
const material = ref(materials[0]);
const hasTilesToUpdate = ref(false);
const observerRegistered = ref(false);

// Function to get the first tile that needs to be updated
function getTileToUpdate(): PrunTile | undefined {
  if (!material.value) {
    return undefined;
  }

  // Check active tiles
  for (const tile of tiles.getActiveTiles()) {
    const newCommand = getNewCommand(tile, material.value);
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

// Watch for changes in material selection
watch(material, () => {
  checkTilesToUpdate();
});

// Register observer on mount
onMounted(() => {
  if (observerRegistered.value) {
    return;
  }

  tiles.observeAll((tile: PrunTile) => {
    if (material.value === undefined) {
      return;
    }

    // If we added a new tile, check if it needs to be updated.
    const newCommand = getNewCommand(tile, material.value!);
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

  const modifier = new TileModifier(tileToUpdate);
  const newCommand = getNewCommand(tileToUpdate, material.value!);
  modifier.changeCommand(newCommand!);
}

function getNewCommand(tile: PrunTile, materialValue: string) {
  let newCommand: string | undefined = undefined;
  // Check if command that accepts material
  switch (tile.command.toUpperCase()) {
    case 'CXOB': // CXOB (material).(exchange)
    case 'CXP': // CXP (material).(exchange)
    case 'CXPC': // CXPC (material).(exchange)
    case 'CXPO': // CXPO (material).(exchange)
      newCommand = getNewTickerCommand(tile, materialValue);
      break;

    case 'CXM': // CXM (material) (planet)
      newCommand = getNewCxmCommand(tile, materialValue);
      break;
    default:
      break;
  }
  return newCommand;
}

function getNewTickerCommand(tile: PrunTile, material: string): string | undefined {
  const arg: string | undefined = tile.parameter?.split(' ')[0];
  if (arg === undefined) {
    return undefined;
  }

  const index = arg.indexOf('.');
  const exchange = arg.substring(index + 1);
  return `${tile.command} ${material}.${exchange}`;
}

function getNewCxmCommand(tile: PrunTile, material: string): string | undefined {
  const args = tile.parameter?.split(' ');
  const planet = (args?.length ?? 0) >= 2 ? args![1] : undefined;
  return `${tile.command} ${material} ${planet}`;
}
</script>

<template>
  <Active label="Material">
    <SelectInput v-model="material" :options="materials" />
  </Active>
  <Commands>
    <PrunButton primary :disabled="!hasTilesToUpdate" @click="onLoadClick">LOAD</PrunButton>
  </Commands>
</template>

<style module></style>
