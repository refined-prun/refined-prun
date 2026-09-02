<script setup lang="ts">
import { MaterialFlow, PlanetContribution } from '@src/core/flow';
import MaterialIcon from '@src/components/MaterialIcon.vue';
import PriceCell from '@src/features/XIT/FLOW/PriceCell.vue';
import { formatPrice } from '@src/features/XIT/FLOW/format';
import { fixed0, fixed1, fixed2 } from '@src/utils/format';

const { flow, last } = defineProps<{ flow: MaterialFlow; last?: boolean }>();

// Tooltips on the last row open upwards so they don't extend the table.
const tooltipPosition = computed(() => (last ? 'top' : 'bottom'));

function formatAmount(value: number) {
  const abs = Math.abs(value);
  let format = fixed2;
  if (abs >= 1000) {
    format = fixed0;
  } else if (abs >= 100) {
    format = fixed1;
  }
  return format(value);
}

const valueText = computed(() =>
  flow.currencyDelta === undefined ? '--' : formatPrice(flow.currencyDelta),
);

function signClass(value: number | undefined) {
  return {
    [C.ColoredValue.positive]: value !== undefined && value > 0,
    [C.ColoredValue.negative]: value !== undefined && value < 0,
  };
}

function formatContribution(contribution: PlanetContribution) {
  const { planetName, naturalId, amount } = contribution;
  const name = planetName === naturalId ? naturalId : `${planetName} (${naturalId})`;
  return `${name}: ${formatAmount(amount)}`;
}
</script>

<template>
  <tr>
    <td :class="$style.materialContainer">
      <MaterialIcon size="inline-table" :ticker="flow.ticker" />
    </td>
    <td :class="signClass(flow.delta)">{{ formatAmount(flow.delta) }}</td>
    <td>{{ formatAmount(flow.production) }}</td>
    <td>{{ formatAmount(flow.consumption) }}</td>
    <PriceCell
      :ticker="flow.ticker"
      side="buy"
      :price="flow.buy"
      :override="flow.buyOverride"
      :tooltip-position="tooltipPosition" />
    <PriceCell
      :ticker="flow.ticker"
      side="sell"
      :price="flow.sell"
      :override="flow.sellOverride"
      :tooltip-position="tooltipPosition" />
    <td :class="signClass(flow.currencyDelta)">{{ valueText }}</td>
    <td :class="$style.planets">
      <div v-for="x in flow.producers" :key="x.naturalId">{{ formatContribution(x) }}</div>
    </td>
    <td :class="$style.planets">
      <div v-for="x in flow.consumers" :key="x.naturalId">{{ formatContribution(x) }}</div>
    </td>
  </tr>
</template>

<style module>
.materialContainer {
  width: 32px;
  padding: 0;
}

.planets {
  white-space: nowrap;
}
</style>
