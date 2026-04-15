<script setup lang="ts">
import { BaseStorageAnalysis } from '@src/core/storage-analysis';
import { fixed0, fixed01 } from '@src/utils/format';
import { formatDays } from '@src/features/XIT/STO/utils';

const { analysis } = defineProps<{ analysis: BaseStorageAnalysis }>();

const netWeight = computed(() => analysis.exportWeight - analysis.importWeight);
const netVolume = computed(() => analysis.exportVolume - analysis.importVolume);

const netWeightClass = computed(() => ({
  [C.ColoredValue.positive]: netWeight.value < 0,
  [C.ColoredValue.negative]: netWeight.value > 0,
}));

const netVolumeClass = computed(() => ({
  [C.ColoredValue.positive]: netVolume.value < 0,
  [C.ColoredValue.negative]: netVolume.value > 0,
}));
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.summary">
      This base has a storage capacity of <b>{{ fixed0(analysis.weightCapacity) }} t</b> and
      <b>{{ fixed0(analysis.volumeCapacity) }} m³</b>.
    </div>
    <table :class="$style.table">
      <thead>
        <tr>
          <th />
          <th>t</th>
          <th>m³</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Import</td>
          <td>{{ fixed01(analysis.importWeight) }}</td>
          <td>{{ fixed01(analysis.importVolume) }}</td>
        </tr>
        <tr>
          <td>Export</td>
          <td>{{ fixed01(analysis.exportWeight) }}</td>
          <td>{{ fixed01(analysis.exportVolume) }}</td>
        </tr>
        <tr>
          <td>Σ (net)</td>
          <td :class="netWeightClass">{{ fixed01(netWeight) }}</td>
          <td :class="netVolumeClass">{{ fixed01(netVolume) }}</td>
        </tr>
        <tr>
          <td>Storage Filled</td>
          <td colspan="2">
            <template v-if="isFinite(analysis.daysUntilFull) && analysis.daysUntilFull < 1000">
              {{ formatDays(analysis.daysUntilFull) }} days
            </template>
            <template v-else>not filling</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style module>
.wrapper {
  min-width: 260px;
}

.summary {
  font-size: 11px;
  margin-bottom: 0.25rem;
}

.table {
  width: 100%;
}

.table th,
.table td {
  padding: 2px 6px;
  text-align: right;
}

.table th:first-child,
.table td:first-child {
  text-align: left;
}
</style>
