<script setup lang="ts">
import fa from '@src/utils/font-awesome.module.css';
import { friendlyConditionText, isConditionFulfilled } from '@src/features/XIT/CONTS/utils';

const props = defineProps({
  condition: {
    type: Object as PropType<PrunApi.ContractCondition>,
    required: true,
  },
});

const isFulfilled = computed(() => isConditionFulfilled(props.condition));
const iconClass = computed(() => ({
  [C.ColoredValue.positive]: isFulfilled.value,
  [C.ColoredValue.negative]: !isFulfilled.value,
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
