<script setup lang="ts">
const { optional, float } = defineProps<{ optional?: boolean; float?: boolean }>();

const model = defineModel<number | undefined>();

// Vue casts a type="number" input through looseToNumber before the setter runs, so the
// incoming value is already a number unless the field is empty or unparseable.
const inputModel = computed({
  get: () => model.value,
  set: (value: number | string) => {
    const parsed = value === '' ? NaN : Number(value);
    if (isNaN(parsed)) {
      model.value = optional ? undefined : 0;
      return;
    }

    model.value = float ? parsed : Math.trunc(parsed);
  },
});
</script>

<template>
  <div>
    <input
      v-model="inputModel"
      type="number"
      :step="float ? 'any' : 1"
      autocomplete="off"
      data-1p-ignore="true"
      data-lpignore="true" />
  </div>
</template>
