<script setup lang="ts">
import fa from '@src/utils/font-awesome.module.css';
import { friendlyConditionText } from '@src/features/XIT/CONTS/utils';
import { fulfillCondition } from '@src/infrastructure/prun-ui/utils/fulfill-condition';
import { isFulfillable } from '@src/core/contract-conditions';

const { condition, contract } = defineProps<{
  condition: PrunApi.ContractCondition;
  contract: PrunApi.Contract;
}>();

function onFulfillClick(event: MouseEvent) {
  void fulfillCondition(event.currentTarget as Element, contract, condition, event.shiftKey);
}

const $style = useCssModule();
const label = computed(() => friendlyConditionText(condition.type));
const tooltip = computed(() => `Fulfill ${label.value}`);

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
    <button
      v-if="isFulfillable(contract, condition)"
      :class="[$style.condition, $style.action, iconClass]"
      :data-tooltip="tooltip"
      data-tooltip-position="left"
      @click="onFulfillClick">
      <span :class="$style.icon">
        <span :class="fa.solid">{{ '\uf04b' }}</span>
      </span>
      <span :class="$style.actionLabel">{{ label }}</span>
    </button>
    <span v-else :class="[$style.condition, iconClass]">
      <span :class="$style.icon">
        <span :class="fa.solid">{{ icon }}</span>
      </span>
      <span>{{ label }}</span>
    </span>
  </div>
</template>

<style module>
.condition {
  display: inline-flex;
  align-items: flex-start;
  gap: 0.125em;
}

.action {
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    outline: 1px solid currentColor;
    outline-offset: 2px;
  }
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.75em;
  height: 1lh;
  flex-shrink: 0;

  > span {
    font-size: 0.75em;
    line-height: 1;
  }
}

.actionLabel {
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, currentColor 40%, transparent);
  text-underline-offset: 0.15em;
}

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
