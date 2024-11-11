<script setup lang="ts">
import { fixed0, fixed2 } from '@src/utils/format';
import MaterialIcon from '@src/components/MaterialIcon.vue';
import { computed, PropType, ref } from 'vue';
import { calcMaterialAmountPrice } from '@src/infrastructure/fio/cx';
import { userData } from '@src/store/user-data';
import { sortMaterialAmounts } from '@src/core/sort-materials';
import { sumBy } from '@src/utils/sum-by';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import PrunButton from '@src/components/PrunButton.vue';

const props = defineProps({
  materials: {
    type: Array as PropType<PrunApi.MaterialAmount[]>,
    required: true,
  },
  collapsible: Boolean,
  collapsedByDefault: Boolean,
});

const collapsed = ref(props.collapsible && props.collapsedByDefault);

const sorted = computed(() => sortMaterialAmounts(props.materials));

function formatPrice(price: number | undefined): string {
  return price !== undefined ? userData.settings.currency + fixed0(price) : '--';
}

function calculateWeight(amount: PrunApi.MaterialAmount) {
  return (amount.material?.weight ?? 0) * amount.amount;
}

function calculateVolume(amount: PrunApi.MaterialAmount) {
  return (amount.material?.volume ?? 0) * amount.amount;
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th />
        <th>Count</th>
        <th>Cost</th>
        <th>Weight</th>
        <th>Volume</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td v-if="collapsible" :class="$style.expand" @click="collapsed = !collapsed">
          {{ collapsed ? '+' : '-' }}
        </td>
        <td v-else />
        <td :class="$style.total">Total</td>
        <td>{{ formatPrice(sumBy(sorted, calcMaterialAmountPrice)) }}</td>
        <td>{{ fixed2(sumBy(sorted, calculateWeight)) }}t</td>
        <td>{{ fixed2(sumBy(sorted, calculateVolume)) }}m³</td>
        <td />
      </tr>
    </tbody>
    <tbody :class="$style.fakeRow">
      <tr>
        <td :class="$style.materialCell">
          <MaterialIcon size="inline-table" ticker="MCG" />
        </td>
        <td>{{ fixed0(100000) }}</td>
        <td>{{ formatPrice(1000000) }}</td>
        <td>{{ fixed2(1000.01) }}t</td>
        <td>{{ fixed2(1000.01) }}m³</td>
        <td><PrunButton dark inline>CXM</PrunButton></td>
      </tr>
    </tbody>
    <tbody v-if="!collapsed">
      <tr v-for="material in sorted" :key="material.material.ticker">
        <td :class="$style.materialCell">
          <MaterialIcon size="inline-table" :ticker="material.material.ticker" />
        </td>
        <td>{{ fixed0(material.amount) }}</td>
        <td>{{ formatPrice(calcMaterialAmountPrice(material)) }}</td>
        <td>{{ fixed2(calculateWeight(material)) }}t</td>
        <td>{{ fixed2(calculateVolume(material)) }}m³</td>
        <td>
          <PrunButton dark inline @click="showBuffer(`CXM ${material.material.ticker}`)">
            CXM
          </PrunButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style module>
.expand {
  text-align: center;
  cursor: pointer;
  user-select: none;
}

.total {
  text-align: right;
}

.materialCell {
  width: 0;
  padding: 0;
}

.fakeRow {
  visibility: collapse;
}
</style>
