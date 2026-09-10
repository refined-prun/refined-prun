<script setup lang="ts">
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import PrunButton from '@src/components/PrunButton.vue';
import RadioItem from '@src/components/forms/RadioItem.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { exchanges, getItemTotal } from '@src/core/item-totals';
import TotalsRow from '@src/features/XIT/TOTALS/TotalsRow.vue';
import { useTileState } from '@src/features/XIT/TOTALS/tile-state';
import {
  formatValue,
  formatVolume,
  formatWeight,
  toParamName,
} from '@src/features/XIT/TOTALS/utils';

const { preset } = defineProps<{ preset: UserData.ItemTotalsPresetData }>();

const wv = useTileState('wv');
const total = useTileState('total');
const cx = useTileState('cx');

const codes = computed(() => cx.value);

const visibleExchanges = computed(() => exchanges.value.filter(x => codes.value.includes(x.code)));

function isShown(code: string) {
  return codes.value.includes(code);
}

function toggleExchange(code: string) {
  cx.value = isShown(code) ? codes.value.filter(x => x !== code) : [...codes.value, code];
}

const rows = computed(() => {
  if (!storagesStore.fetched.value) {
    return undefined;
  }
  return preset.items.filter(x => x.ticker.length > 0).map(x => getItemTotal(x.ticker));
});

// Totals across every item in the preset. A column with a missing price
// totals to undefined, so a partial sum is never shown as a real number.
const totals = computed(() => {
  const list = rows.value;
  if (!list) {
    return undefined;
  }
  return {
    weight: sumBy(list, x => x.weight),
    volume: sumBy(list, x => x.volume),
    values: visibleExchanges.value.map(exchange =>
      sumBy(list, x => x.values.find(v => v.code === exchange.code)?.value),
    ),
  };
});
</script>

<template>
  <LoadingSpinner v-if="rows === undefined || totals === undefined" />
  <template v-else>
    <div :class="C.ComExOrdersPanel.filter">
      <RadioItem v-model="wv" horizontal>W/V</RadioItem>
      <div :class="$style.separator" />
      <RadioItem
        v-for="exchange in exchanges"
        :key="exchange.code"
        horizontal
        :model-value="isShown(exchange.code)"
        @update:model-value="toggleExchange(exchange.code)">
        {{ exchange.code }}
      </RadioItem>
      <div :class="$style.separator" />
      <RadioItem v-model="total" horizontal>TOTAL</RadioItem>
    </div>
    <div v-if="rows.length === 0" :class="$style.empty">
      <div>This preset has no items yet.</div>
      <PrunButton primary @click="showBuffer(`XIT TOTALS_EDIT_${toParamName(preset.name)}`)">
        CONFIGURE
      </PrunButton>
    </div>
    <table v-else>
      <thead>
        <tr>
          <th>Item</th>
          <th>Amt</th>
          <template v-if="wv">
            <th :class="$style.numberColumn">Weight</th>
            <th :class="$style.numberColumn">Volume</th>
          </template>
          <th
            v-for="exchange in visibleExchanges"
            :key="exchange.code"
            :class="$style.numberColumn">
            {{ exchange.code }}
          </th>
        </tr>
      </thead>
      <tbody>
        <TotalsRow v-for="row in rows" :key="row.ticker" :row="row" :codes="codes" :show-wv="wv" />
        <tr v-if="total" :class="C.IncomeStatementPanel.totals">
          <td :class="C.IncomeStatementPanel.number">Total</td>
          <td />
          <template v-if="wv">
            <td :class="$style.numberColumn">{{ formatWeight(totals.weight) }}</td>
            <td :class="$style.numberColumn">{{ formatVolume(totals.volume) }}</td>
          </template>
          <td
            v-for="(exchange, i) in visibleExchanges"
            :key="exchange.code"
            :class="$style.numberColumn">
            {{ formatValue(totals.values[i], exchange.currency.code) }}
          </td>
        </tr>
      </tbody>
    </table>
  </template>
</template>

<style module>
.empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem;
}

.separator {
  width: 1px;
  align-self: stretch;
  background-color: #2b485a;
  margin: 0 0.25rem;
}

.numberColumn {
  text-align: right;
}
</style>
