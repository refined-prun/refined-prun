<script setup lang="ts">
import Passive from '@src/components/forms/Passive.vue';

defineProps<{
  label: string;
  sourceName: string;
  resolvedValue: string | undefined;
}>();
</script>

<template>
  <form>
    <Passive :label="label">
      <span>Same as {{ sourceName }} → {{ resolvedValue ?? '...' }}</span>
    </Passive>
  </form>
</template>
