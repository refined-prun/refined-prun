<script setup lang="ts">
import PrunCss from '@src/prun-ui/prun-css';
import { showBuffer } from '@src/util';
import { computed } from 'vue';
import { useCssModule } from 'vue';
import ColoredIcon from '@src/components/ColoredIcon.vue';

const props = defineProps({
  ticker: {
    type: String,
    required: true,
  },
  small: Boolean,
  amount: {
    type: Number,
    required: false,
    default: undefined,
  },
});

const $style = useCssModule();
const containerClasses = computed(() => [
  PrunCss.MaterialIcon.container,
  $style.container,
  {
    [$style.small]: props.small,
    [$style.large]: !props.small,
  },
]);

const amountClasses = [
  PrunCss.MaterialIcon.indicator,
  PrunCss.MaterialIcon.neutral,
  PrunCss.MaterialIcon.typeVerySmall,
];

const onClick = () => showBuffer(`MAT ${props.ticker.toUpperCase()}`);
</script>

<template>
  <div :class="containerClasses">
    <ColoredIcon :ticker="ticker" :on-click="onClick" />
    <div v-if="amount" :class="PrunCss.MaterialIcon.indicatorContainer">
      <div :class="amountClasses">{{ amount }}</div>
    </div>
  </div>
</template>

<style module>
.container {
  cursor: pointer;
}

.large {
  height: 48px;
  width: 48px;
}

.large div.ColoredIcon__container___djaR4r2 {
  height: 48px;
  width: 48px;
  font-size: 15.84px;
  cursor: pointer;
}

.small {
  height: 32px;
  width: 32px;
}
</style>
