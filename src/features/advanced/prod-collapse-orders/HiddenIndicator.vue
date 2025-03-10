<script setup lang="ts">
import { defineProps } from 'vue';
defineProps<{ amtHidden: number }>();
</script>

<template>
  <div v-if="amtHidden" :class="[C.type.typeSmall, $style.hiddenIndicator]">
    +{{ amtHidden }} more
  </div>
</template>

<style module>
.hiddenIndicator {
  font-size: 9px;
  margin: -1px;
  text-align: center;
}
</style>
