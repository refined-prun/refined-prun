<script setup lang="ts">
import grip from './grip.module.css';
import GripChar from '@src/components/grip/GripChar.vue';
</script>

<template>
  <td :class="[grip.grip, $style.gripCell]">
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
