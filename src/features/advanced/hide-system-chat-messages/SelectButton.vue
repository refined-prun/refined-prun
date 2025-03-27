<script setup lang="ts">
import RadioItem from '@src/components/forms/RadioItem.vue';

const { selected, set } = defineProps<{
  label: string;
  selected?: boolean;
  set: (value: boolean) => void;
}>();

const model = computed({
  get: () => selected,
  set: value => set(value),
});
</script>

<template>
  <div :class="C.SelectButton.container">
    <RadioItem v-model="model">
      {{ label }}
    </RadioItem>
  </div>
</template>
