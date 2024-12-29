<script setup lang="ts">
import fa from '@src/utils/font-awesome.module.css';
import { friendlyConditionText, isConditionFulfilled } from '@src/features/XIT/CONTS/utils';

const { condition } = defineProps<{ condition: PrunApi.ContractCondition }>();

const $style = useCssModule();

const isFulfilled = computed(() => isConditionFulfilled(condition));
const iconClass = computed(() => {
  switch (condition.status) {
    case 'PENDING':
      return condition.deadline ? $style.pending : $style.unavailable;
    case 'IN_PROGRESS':
    case 'PARTLY_FULFILLED':
      return $style.pending;
    case 'FULFILLMENT_ATTEMPTED':
    case 'VIOLATED':
      return $style.failed;
    case 'FULFILLED':
      return $style.fulfilled;
  }
});
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

<style module>
.pending {
  color: var(--rp-color-orange);
}

.fulfilled {
  color: var(--rp-color-green);
}

.failed {
  color: var(--rp-color-red);
}

.unavailable {
  color: var(--rp-color-text);
}
</style>
