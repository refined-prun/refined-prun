<script setup lang="ts">
import RadioItem from '@src/components/forms/RadioItem.vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  selected: Boolean,
  set: {
    type: Function as PropType<(value: boolean) => void>,
    required: true,
  },
});

const model = computed({
  get: () => props.selected,
  set: value => props.set(value),
});
</script>

<template>
  <div class="SelectButton__container___vjN14Xf">
    <RadioItem v-model="model">
      {{ label }}
    </RadioItem>
  </div>
</template>
