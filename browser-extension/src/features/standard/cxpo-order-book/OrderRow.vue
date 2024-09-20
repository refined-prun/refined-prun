<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { computed, PropType, useCssModule } from 'vue';
import { companyStore } from '@src/infrastructure/prun-api/data/company';
import { fixed0, fixed2 } from '@src/utils/format';

const props = defineProps({
  order: {
    type: Object as PropType<PrunApi.CXBrokerOrder>,
    required: true,
  },
  request: Boolean,
});

const $style = useCssModule();
const ownOrderClass = computed(() => ({
  [$style.own]: props.order.amount && props.order.trader.id === companyStore.value?.id,
}));
const amount = computed(() => (props.order.amount ? fixed0(props.order.amount) : '∞'));
const amountClass = computed(() => [PrunCss.ComExOrderBookPanel.amount, ownOrderClass.value]);
const price = computed(() => fixed2(props.order.limit.amount));
const priceClass = computed(() => [
  props.request ? PrunCss.ComExOrderBookPanel.requestPrice : PrunCss.ComExOrderBookPanel.offerPrice,
  ownOrderClass.value,
  $style.price,
]);
</script>

<template>
  <tr>
    <td :class="amountClass">{{ amount }}</td>
    <td :class="priceClass">{{ price }}</td>
  </tr>
</template>

<style module>
table tbody td.own {
  background: rgba(255, 255, 255, 0.15);
}

/*
  Override left/right padding from vanilla class
*/
table tbody td.price {
  padding: 2px;
}
</style>
