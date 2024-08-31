<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { computed, PropType } from 'vue';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { fixed0, fixed2 } from '@src/utils/format';

const props = defineProps({
  order: {
    type: Object as PropType<PrunApi.CXBrokerOrder>,
    required: true,
  },
  request: Boolean,
});

const ownOrderClass = computed(() => ({
  'rp-cxpo-order-column--own-order':
    props.order.amount && props.order.trader.id === companyStore.id,
}));
const amount = computed(() => (props.order.amount ? fixed0(props.order.amount) : '∞'));
const amountClass = computed(() => [PrunCss.ComExOrderBookPanel.amount, ownOrderClass.value]);
const price = computed(() => fixed2(props.order.limit.amount));
const priceClass = computed(() => [
  props.request ? PrunCss.ComExOrderBookPanel.requestPrice : PrunCss.ComExOrderBookPanel.offerPrice,
  ownOrderClass.value,
  'rp-cxpo-order-column--price',
]);
</script>

<template>
  <tr>
    <td :class="amountClass">{{ amount }}</td>
    <td :class="priceClass" :style="{ padding: '2px' }">
      {{ price }}
    </td>
  </tr>
</template>

<style scoped>
table tbody td.rp-cxpo-order-column--own-order {
  background: rgba(255, 255, 255, 0.15);
}

/*
  Override left/right padding from vanilla class
*/
table tbody td.rp-cxpo-order-column--price {
  padding: 2px;
}
</style>
