<script setup lang="ts">
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { userData } from '@src/store/user-data';
import TotalsPresetList from '@src/features/XIT/TOTALS/TotalsPresetList.vue';
import EditTotalsPreset from '@src/features/XIT/TOTALS/EditTotalsPreset.vue';
import TotalsDisplay from '@src/features/XIT/TOTALS/TotalsDisplay.vue';

const parameters = useXitParameters();
parameters.unshift('TOTALS');

let presetName = undefined as string | undefined;
const edit = parameters[1]?.toLowerCase() === 'edit';
if (edit) {
  presetName = parameters.slice(2).join(' ');
}
const show = parameters[1] !== undefined && !edit;
if (show) {
  presetName = parameters.slice(1).join(' ');
}

const preset = computed(() => userData.itemTotalsPresets.find(x => x.name === presetName));
</script>

<template>
  <TotalsPresetList v-if="parameters.length === 1" />
  <div v-else-if="!preset">Totals preset "{{ presetName }}" not found.</div>
  <EditTotalsPreset v-else-if="edit" :preset="preset" />
  <TotalsDisplay v-else :preset="preset" />
</template>
