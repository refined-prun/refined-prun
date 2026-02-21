<script setup lang="ts">
defineProps<{ group: UserData.MaterialGroupData }>();

function validate() {
  return true;
}

function save() {
  // No design-time settings — materials are pasted at execution time.
}

defineExpose({ validate, save });
</script>

<template>
  <div />
</template>
