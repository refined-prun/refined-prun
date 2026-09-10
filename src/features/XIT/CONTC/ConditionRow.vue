<script setup lang="ts">
import ContractLink from '@src/features/XIT/CONTC/ContractLink.vue';
import { timestampEachSecond } from '@src/utils/dayjs';
import dayjs from 'dayjs';
import ConditionText from '@src/features/XIT/CONTC/ConditionText.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { isFulfillable } from '@src/core/contract-conditions';
import { fulfillCondition } from '@src/infrastructure/prun-ui/utils/fulfill-condition';

const { deadline, contract, condition } = defineProps<{
  condition: PrunApi.ContractCondition;
  contract: PrunApi.Contract;
  deadline: number;
  showFulfill: boolean;
}>();

function onFulfillClick(event: MouseEvent) {
  void fulfillCondition(event.currentTarget as Element, contract, condition, event.shiftKey);
}

const eta = computed(() => {
  if (!isFinite(deadline)) {
    return '∞';
  }
  if (deadline <= timestampEachSecond.value) {
    return '-';
  }
  let duration = dayjs.duration({ milliseconds: deadline - timestampEachSecond.value });
  const days = Math.floor(duration.asDays());
  duration = duration.subtract(days, 'days');
  const hours = Math.floor(duration.asHours());
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  duration = duration.subtract(hours, 'hours');
  const minutes = Math.floor(duration.asMinutes());
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  duration = duration.subtract(minutes, 'minutes');
  const seconds = Math.floor(duration.asSeconds());
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
});
</script>

<template>
  <tr>
    <td>
      <ContractLink :contract="contract" />
    </td>
    <td>
      {{ eta }}
    </td>
    <td>
      <ConditionText :condition="condition" />
    </td>
    <td v-if="showFulfill" :class="$style.fulfillCell">
      <PrunButton v-if="isFulfillable(contract, condition)" success inline @click="onFulfillClick">
        {{ L.ContractCondition.fulfill() }}
      </PrunButton>
    </td>
  </tr>
</template>

<style module>
.fulfillCell {
  padding: 2px 4px;
  width: 0;
  height: 0;
}
</style>
