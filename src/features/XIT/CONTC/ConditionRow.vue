<script setup lang="ts">
import ConditionText from '@src/features/XIT/CONTC/ConditionText.vue';
import ContractLink from '@src/features/XIT/CONTC/ContractLink.vue';
import { timestampEachHour } from '@src/utils/dayjs';
import dayjs from 'dayjs';

const { deadline } = defineProps<{
  condition: PrunApi.ContractCondition;
  contract: PrunApi.Contract;
  deadline: number;
}>();

const eta = computed(() => {
  if (!isFinite(deadline)) {
    return '∞';
  }
  const timestamp = timestampEachHour.value;
  if (deadline <= timestamp) {
    return '-';
  }
  let duration = dayjs.duration({ milliseconds: deadline - timestamp });
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
  </tr>
</template>
