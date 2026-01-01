<script setup lang="ts">
import { TileModifier } from './tile-modifier';
import { exchangesStore } from '@src/infrastructure/prun-api/data/exchanges';
import PrunButton from '@src/components/PrunButton.vue';
import Active from '@src/components/forms/Active.vue';
import Commands from '@src/components/forms/Commands.vue';
import SelectInput from '@src/components/forms/SelectInput.vue';

const exchanges = computed(() =>
  (exchangesStore.all.value ?? [])
    .map(exchange => ({
      label: exchange.name,
      value: exchange.code,
    }))
    .sort((a, b) => a.label.localeCompare(b.label)),
);
const exchange = ref(exchanges[0]);
const hasTilesToUpdate = ref(false);
const observerRegistered = ref(false);

// Function to get the first tile that needs to be updated
function getTileToUpdate(): PrunTile | undefined {
  if (!exchange.value) {
    return undefined;
  }

  // Check active tiles
  for (const tile of tiles.getActiveTiles()) {
    const newCommand = getNewCommand(tile, exchange.value);
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

// Watch for changes in exchange selection
watch(exchange, () => {
  checkTilesToUpdate();
});

// Register observer on mount
onMounted(() => {
  if (observerRegistered.value) {
    return;
  }

  tiles.observeAll((tile: PrunTile) => {
    if (exchange.value === undefined) {
      return;
    }

    // If we added a new tile, check if it needs to be updated.
    const newCommand = getNewCommand(tile, exchange.value!);
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
  const newCommand = getNewCommand(tileToUpdate, exchange.value!);
  modifier.changeCommand(newCommand!);
}

function getNewCommand(tile: PrunTile, exchangeValue: string) {
  let newCommand: string | undefined = undefined;
  // Check if command that accepts exchange
  switch (tile.command.toUpperCase()) {
    case 'CX': // CX (exchange)
      newCommand = `${tile.command} ${exchangeValue}`;
      break;

    case 'CXOB': // CXOB (material).(exchange)
    case 'CXP': // CXP (material).(exchange)
    case 'CXPC': // CXPC (material).(exchange)
    case 'CXPO': // CXPO (material).(exchange)
      newCommand = getNewTickerCommand(tile, exchangeValue);
      break;

    default:
      break;
  }
  return newCommand;
}

function getNewTickerCommand(tile: PrunTile, exchange: string): string | undefined {
  const arg: string | undefined = tile.parameter?.split(' ')[0];
  if (arg === undefined) {
    return undefined;
  }

  const index = arg.indexOf('.');
  const material = arg.substring(0, index);
  return `${tile.command} ${material}.${exchange}`;
}
</script>

<template>
  <Active label="Exchange">
    <SelectInput v-model="exchange" :options="exchanges" />
  </Active>
  <Commands>
    <PrunButton primary :disabled="!hasTilesToUpdate" @click="onLoadClick">LOAD</PrunButton>
  </Commands>
</template>

<style module></style>
