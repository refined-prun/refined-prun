<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import ContextControlsItem from '@src/components/ContextControlsItem.vue';

interface Item {
  cmd: string;
  label?: string;
}

defineProps({
  items: {
    type: Array<Item>,
    required: true,
  },
});
</script>

<template>
  <div :class="PrunCss.ContextControls.container">
    <ContextControlsItem
      v-for="item in items"
      :key="item.cmd"
      :cmd="item.cmd"
      :label="item.label" />
  </div>
</template>
