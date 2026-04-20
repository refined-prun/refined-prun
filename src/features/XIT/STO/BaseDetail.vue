<script setup lang="ts">
import { BaseStorageAnalysis } from '@src/core/storage-analysis';
import { computeNeed, getPlanetBurn } from '@src/core/burn';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { userData } from '@src/store/user-data';
import VisitationTable from '@src/features/XIT/STO/VisitationTable.vue';
import { fixed01, fixed0, percent0 } from '@src/utils/format';
import { formatDays } from '@src/features/XIT/STO/utils';

const { analysis } = defineProps<{ analysis: BaseStorageAnalysis }>();

interface MaterialRow {
  ticker: string;
  weight: number;
  volume: number;
  amount: number;
}

const planetBurn = computed(() => getPlanetBurn(analysis.siteId));

const shippingOut = computed<MaterialRow[]>(() => {
  const pb = planetBurn.value;
  if (!pb) {
    return [];
  }
  const rows: MaterialRow[] = [];
  for (const ticker of Object.keys(pb.burn)) {
    const mb = pb.burn[ticker];
    if (mb.dailyAmount <= 0 || mb.inventory <= 0) {
      continue;
    }
    const mat = materialsStore.getByTicker(ticker);
    if (!mat) {
      continue;
    }
    rows.push({
      ticker,
      amount: mb.inventory,
      weight: mb.inventory * mat.weight,
      volume: mb.inventory * mat.volume,
    });
  }
  rows.sort((a, b) => b.weight - a.weight);
  return rows;
});

const adding = computed<MaterialRow[]>(() => {
  const pb = planetBurn.value;
  if (!pb) {
    return [];
  }
  const resupply = userData.settings.burn.resupply;
  const rows: MaterialRow[] = [];
  for (const ticker of Object.keys(pb.burn)) {
    const mb = pb.burn[ticker];
    const need = computeNeed(mb, resupply);
    if (need <= 0) {
      continue;
    }
    const mat = materialsStore.getByTicker(ticker);
    if (!mat) {
      continue;
    }
    rows.push({
      ticker,
      amount: need,
      weight: need * mat.weight,
      volume: need * mat.volume,
    });
  }
  rows.sort((a, b) => b.weight - a.weight);
  return rows;
});

const afterShipOutWeightLoad = computed(
  () => analysis.weightCapacity - analysis.availableAfterShipOutWeight,
);
const afterShipOutVolumeLoad = computed(
  () => analysis.volumeCapacity - analysis.availableAfterShipOutVolume,
);

const afterResupplyWeightLoad = computed(
  () => analysis.weightCapacity * analysis.needFillPercentWeight,
);
const afterResupplyVolumeLoad = computed(
  () => analysis.volumeCapacity * analysis.needFillPercentVolume,
);

const fillPercent = computed(() => Math.round((1 - analysis.suppliesReserveFraction) * 100));
const reservePercent = computed(() => Math.round(analysis.suppliesReserveFraction * 100));
const reserveReason = computed(() =>
  analysis.suppliesReserveFraction >= 0.2 ? 'produced goods' : 'production variance',
);

const bindingLabel = computed(() => {
  if (analysis.bindingLimit === 't') {
    return 'Weight (t) is the binding dimension';
  }
  if (analysis.bindingLimit === 'm³') {
    return 'Volume (m³) is the binding dimension';
  }
  return 'Storage draining — nothing is actively filling it';
});

const overflowAmount = computed(() => {
  const w = afterResupplyWeightLoad.value - analysis.weightCapacity;
  const v = afterResupplyVolumeLoad.value - analysis.volumeCapacity;
  return { w, v };
});
</script>

<template>
  <div :class="$style.detail">
    <section :class="[$style.panel, $style.blue]">
      <h3 :class="$style.title">Fill Summary</h3>
      <table :class="$style.numTable">
        <thead>
          <tr>
            <th />
            <th>Weight (t)</th>
            <th>Weight %</th>
            <th>Volume (m³)</th>
            <th>Volume %</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th :class="$style.rowLabel">Capacity</th>
            <td>{{ fixed0(analysis.weightCapacity) }}</td>
            <td>—</td>
            <td>{{ fixed0(analysis.volumeCapacity) }}</td>
            <td>—</td>
          </tr>
          <tr>
            <th :class="$style.rowLabel">Now</th>
            <td>{{ fixed0(analysis.weightLoad) }}</td>
            <td>{{ percent0(analysis.fillPercentWeight) }}</td>
            <td>{{ fixed0(analysis.volumeLoad) }}</td>
            <td>{{ percent0(analysis.fillPercentVolume) }}</td>
          </tr>
          <tr>
            <th :class="$style.rowLabel">After ship-out</th>
            <td>{{ fixed0(afterShipOutWeightLoad) }}</td>
            <td>
              {{ percent0(afterShipOutWeightLoad / analysis.weightCapacity) }}
            </td>
            <td>{{ fixed0(afterShipOutVolumeLoad) }}</td>
            <td>
              {{ percent0(afterShipOutVolumeLoad / analysis.volumeCapacity) }}
            </td>
          </tr>
          <tr :class="{ [$style.danger]: analysis.needFillRatio > 1 }">
            <th :class="$style.rowLabel">After resupply</th>
            <td>{{ fixed0(afterResupplyWeightLoad) }}</td>
            <td>{{ percent0(analysis.needFillPercentWeight) }}</td>
            <td>{{ fixed0(afterResupplyVolumeLoad) }}</td>
            <td>{{ percent0(analysis.needFillPercentVolume) }}</td>
          </tr>
        </tbody>
      </table>
      <div :class="$style.note">{{ bindingLabel }}.</div>
      <div v-if="overflowAmount.w > 0" :class="[$style.note, $style.alertText]">
        Weight overflow after resupply:
        <b>{{ fixed0(overflowAmount.w) }} t over capacity</b>
      </div>
      <div v-if="overflowAmount.v > 0" :class="[$style.note, $style.alertText]">
        Volume overflow after resupply:
        <b>{{ fixed0(overflowAmount.v) }} m³ over capacity</b>
      </div>
      <div v-if="overflowAmount.w <= 0 && overflowAmount.v <= 0" :class="$style.note">
        Headroom after resupply:
        <b>
          {{ fixed0(analysis.weightCapacity - afterResupplyWeightLoad) }} t /
          {{ fixed0(analysis.volumeCapacity - afterResupplyVolumeLoad) }} m³
        </b>
      </div>
      <div :class="$style.note">
        Full in <b>{{ formatDays(analysis.daysUntilFull) }} days</b> at net
        {{ fixed01(analysis.exportWeight - analysis.importWeight) }} t /
        {{ fixed01(analysis.exportVolume - analysis.importVolume) }} m³ per day.
      </div>
    </section>

    <section :class="[$style.panel, $style.teal]">
      <h3 :class="$style.title">Visitation Frequency</h3>
      <div :class="$style.note">
        How long before a ship of this size would be needed, given current import/export rates.
      </div>
      <VisitationTable :analysis="analysis" />
    </section>

    <section :class="[$style.panel, $style.green]">
      <h3 :class="$style.title">Days of Supplies That Fit</h3>
      <div v-if="!isFinite(analysis.daysOfSuppliesFit)" :class="$style.big">
        ∞ (no active consumers)
      </div>
      <div v-else :class="$style.big">{{ fixed01(analysis.daysOfSuppliesFit) }} days</div>
      <div v-if="isFinite(analysis.daysOfSuppliesFit)" :class="$style.note">
        Total consumables the base holds when filled to <b>{{ fillPercent }}%</b> after ship-out ({{
          reservePercent
        }}% reserved for {{ reserveReason }}). Includes consumables already in storage.
      </div>
      <div :class="$style.note"
        >Current resupply target: {{ userData.settings.burn.resupply }} days.</div
      >
    </section>

    <section :class="[$style.panel, $style.orange]">
      <h3 :class="$style.title">Shipping Out ({{ shippingOut.length }} materials)</h3>
      <div v-if="shippingOut.length === 0" :class="$style.empty">No produced goods in storage.</div>
      <table v-else :class="$style.numTable">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Amount</th>
            <th>Weight (t)</th>
            <th>Volume (m³)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in shippingOut" :key="row.ticker">
            <td>{{ row.ticker }}</td>
            <td>{{ fixed0(row.amount) }}</td>
            <td>{{ fixed01(row.weight) }}</td>
            <td>{{ fixed01(row.volume) }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section :class="[$style.panel, $style.purple]">
      <h3 :class="$style.title">Adding — Resupply Needs ({{ adding.length }} materials)</h3>
      <div v-if="adding.length === 0" :class="$style.empty">Nothing needs resupply right now.</div>
      <table v-else :class="$style.numTable">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Need</th>
            <th>Weight (t)</th>
            <th>Volume (m³)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in adding" :key="row.ticker">
            <td>{{ row.ticker }}</td>
            <td>{{ fixed0(row.amount) }}</td>
            <td>{{ fixed01(row.weight) }}</td>
            <td>{{ fixed01(row.volume) }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style module>
.detail {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0.75rem;
  padding: 0.75rem;
}

.panel {
  border-left: 3px solid currentColor;
  border-radius: 3px;
  padding: 0.5rem 0.75rem;
  background-color: rgba(255, 255, 255, 0.03);
}

.title {
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 0.4rem 0;
  color: inherit;
}

.numTable {
  width: 100%;
  font-size: 11px;
}

.numTable th,
.numTable td {
  padding: 2px 6px;
  text-align: right;
}

.numTable th:first-child,
.numTable td:first-child {
  text-align: left;
}

.rowLabel {
  font-weight: normal;
  opacity: 0.8;
}

.note {
  font-size: 11px;
  margin-top: 0.3rem;
  opacity: 0.85;
}

.alertText {
  color: #d9534f;
  font-weight: bold;
  opacity: 1;
}

.big {
  font-size: 14px;
  font-weight: bold;
  margin: 0.2rem 0;
}

.empty {
  font-style: italic;
  opacity: 0.6;
  font-size: 11px;
}

.danger {
  background-color: rgba(217, 83, 79, 0.12);
}

.blue {
  color: #6495ed;
}

.green {
  color: #5cb85c;
}

.orange {
  color: #f0ad4e;
}

.purple {
  color: #b19cd9;
}

.teal {
  color: #5bc0de;
}
</style>
