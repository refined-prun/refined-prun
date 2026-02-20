<script setup lang="ts">
import { grip } from './index';
import GripChar from '@src/components/grip/GripChar.vue';
</script>

<template>
  <td :class="[grip.class, $style.gripCell]">
    <GripChar :class="$style.grip" />
  </td>
</template>

<style module>
.gripCell {
  width: 14px;
  padding: 0;
  text-align: center;
  cursor: move;
}

.grip {
  transition: opacity 0.2s ease-in-out;
  opacity: 0;
}

tr:hover .grip {
  opacity: 1;
}
</style>
