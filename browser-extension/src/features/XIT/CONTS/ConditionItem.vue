<script setup lang="ts">
import fa from '@src/utils/font-awesome.module.css';
import { computed, PropType } from 'vue';
import { friendlyConditionText, isConditionFulfilled } from '@src/features/XIT/CONTS/utils';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';

const props = defineProps({
  condition: {
    type: Object as PropType<PrunApi.ContractCondition>,
    required: true,
  },
});

const isFulfilled = computed(() => isConditionFulfilled(props.condition));
const iconClass = computed(() => ({
  [PrunCss.ColoredValue.positive]: isFulfilled.value,
  [PrunCss.ColoredValue.negative]: !isFulfilled.value,
}));
const icon = computed(() => (isFulfilled.value ? '\uf00c' : '\uf00d'));
</script>

<template>
  <div>
    <span :class="iconClass">
      <span :class="[fa.solid]">{{ icon }}</span
      >&nbsp;{{ friendlyConditionText(condition.type) }}
    </span>
  </div>
</template>
