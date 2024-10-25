<script setup lang="ts">
import { computed, PropType } from 'vue';
import ContractLink from '@src/features/XIT/CONTC/ContractLink.vue';
import { timestampEachSecond } from '@src/utils/dayjs';
import dayjs from 'dayjs';
import ConditionText from '@src/features/XIT/CONTC/ConditionText.vue';

const props = defineProps({
  contract: {
    type: Object as PropType<PrunApi.Contract>,
    required: true,
  },
  condition: {
    type: Object as PropType<PrunApi.ContractCondition>,
    required: true,
  },
  deadline: {
    type: Number,
    required: true,
  },
});

const eta = computed(() => {
  if (!isFinite(props.deadline)) {
    return '∞';
  }
  if (props.deadline <= timestampEachSecond.value) {
    return '-';
  }
  let duration = dayjs.duration({ milliseconds: props.deadline - timestampEachSecond.value });
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
