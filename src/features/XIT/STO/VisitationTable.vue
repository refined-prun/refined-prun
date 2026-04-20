<script setup lang="ts">
import { BaseStorageAnalysis } from '@src/core/storage-analysis';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { fixed0 } from '@src/utils/format';
import { formatDays } from '@src/features/XIT/STO/utils';

const { analysis } = defineProps<{ analysis: BaseStorageAnalysis }>();

interface ShipRow {
  shipT: number;
  shipM3: number;
  exportDays: number;
  exportLimit: 't' | 'm³' | undefined;
  importDays: number;
  importLimit: 't' | 'm³' | undefined;
}

// Each unique (weightCapacity, volumeCapacity) pair from the player's fleet becomes one row.
const rows = computed<ShipRow[]>(() => {
  const ships = shipsStore.all.value;
  if (!ships) {
    return [];
  }
  const seen = new Map<string, { shipT: number; shipM3: number }>();
  for (const ship of ships) {
    const store = storagesStore.getById(ship.idShipStore);
    if (!store) {
      continue;
    }
    const key = `${store.weightCapacity}|${store.volumeCapacity}`;
    if (!seen.has(key)) {
      seen.set(key, { shipT: store.weightCapacity, shipM3: store.volumeCapacity });
    }
  }
  const sorted = [...seen.values()].sort((a, b) =>
    a.shipT !== b.shipT ? a.shipT - b.shipT : a.shipM3 - b.shipM3,
  );
  return sorted.map(({ shipT, shipM3 }) => {
    const expT = analysis.exportWeight > 0 ? shipT / analysis.exportWeight : Infinity;
    const expV = analysis.exportVolume > 0 ? shipM3 / analysis.exportVolume : Infinity;
    const impT = analysis.importWeight > 0 ? shipT / analysis.importWeight : Infinity;
    const impV = analysis.importVolume > 0 ? shipM3 / analysis.importVolume : Infinity;
    const exportDays = Math.min(expT, expV);
    const importDays = Math.min(impT, impV);
    const exportLimit: 't' | 'm³' | undefined =
      exportDays === Infinity ? undefined : expT < expV ? 't' : 'm³';
    const importLimit: 't' | 'm³' | undefined =
      importDays === Infinity ? undefined : impT < impV ? 't' : 'm³';
    return { shipT, shipM3, exportDays, exportLimit, importDays, importLimit };
  });
});
</script>

<template>
  <div v-if="rows.length === 0" :class="$style.empty">No ships in fleet</div>
  <table v-else :class="$style.table">
    <thead>
      <tr>
        <th rowspan="2">Ship t</th>
        <th rowspan="2">Ship m³</th>
        <th colspan="2">Export Frequency</th>
        <th colspan="2">Import Frequency</th>
      </tr>
      <tr>
        <th>Visitation (days)</th>
        <th>Limit</th>
        <th>Visitation (days)</th>
        <th>Limit</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="`${row.shipT}|${row.shipM3}`">
        <td>{{ fixed0(row.shipT) }}</td>
        <td>{{ fixed0(row.shipM3) }}</td>
        <td>{{ formatDays(row.exportDays) }}</td>
        <td>{{ row.exportLimit ?? '—' }}</td>
        <td>{{ formatDays(row.importDays) }}</td>
        <td>{{ row.importLimit ?? '—' }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style module>
.table {
  min-width: 300px;
}

.empty {
  font-style: italic;
  opacity: 0.7;
  padding: 0.5rem;
}
</style>
