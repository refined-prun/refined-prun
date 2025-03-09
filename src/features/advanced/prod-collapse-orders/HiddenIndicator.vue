<script setup lang="ts">
import { defineProps } from 'vue';
defineProps({
  amtHidden: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <div v-if="amtHidden" :class="[C.type.typeSmall, $style.hiddenIndicator]">
    +{{ amtHidden }} more
  </div>
</template>

<style module>
.hiddenIndicator {
  font-size: 9px;
  text-align: center;
}
</style>
