<script setup lang="ts">
import fa from '@src/utils/font-awesome.module.css';
import { friendlyConditionText } from '@src/features/XIT/CONTS/utils';

const { condition, contract } = defineProps<{
  condition: PrunApi.ContractCondition;
  contract: PrunApi.Contract;
}>();

const $style = useCssModule();

const iconClass = computed(() => {
  switch (condition.status) {
    case 'PENDING': {
      for (const dependency of condition.dependencies) {
        const match = contract.conditions.find(x => x.id === dependency);
        if (!match || match.status !== 'FULFILLED') {
          return $style.unavailable;
        }
      }
      return $style.pending;
    }
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
const icon = computed(() => (condition.status === 'FULFILLED' ? '\uf00c' : '\uf00d'));
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
