<script setup lang="ts">
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { userData } from '@src/store/user-data';
import StockPresetList from '@src/features/XIT/STOCK/StockPresetList.vue';
import EditStockPreset from '@src/features/XIT/STOCK/EditStockPreset.vue';
import StockDisplay from '@src/features/XIT/STOCK/StockDisplay.vue';

const parameters = useXitParameters();
parameters.unshift('STOCK');

let presetName = undefined as string | undefined;
const edit = parameters[1]?.toLowerCase() === 'edit';
if (edit) {
  presetName = parameters.slice(2).join(' ');
}
const show = parameters[1] !== undefined && !edit;
if (show) {
  presetName = parameters.slice(1).join(' ');
}

const preset = computed(() => userData.stockPresets.find(x => x.name === presetName));
</script>

<template>
  <StockPresetList v-if="parameters.length === 1" />
  <div v-else-if="!preset">Stock preset "{{ presetName }}" not found.</div>
  <EditStockPreset v-else-if="edit" :preset="preset" />
  <StockDisplay v-else :preset="preset" />
</template>
