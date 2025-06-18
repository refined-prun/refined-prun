<script setup lang="ts">
import RadioItem from '@src/components/forms/RadioItem.vue';
import { WorkforceFilter } from '@src/features/advanced/wf-workforce-filters/tile-state';

const { filters } = defineProps<{ filters: WorkforceFilter[] }>();
</script>

<template>
  <div :class="$style.bar">
    <RadioItem v-for="filter in filters" :key="filter.workforce" v-model="filter.value" horizontal>
      {{ filter.workforce.substring(0, 3) }}
    </RadioItem>
  </div>
</template>

<style module>
.bar {
  display: flex;
  align-items: center;
  column-gap: 3px;
  padding: 4px 0 0 6px;
}
</style>
