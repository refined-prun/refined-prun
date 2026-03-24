<script setup lang="ts">
import fa from '@src/utils/font-awesome.module.css';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';

const { chartId } = defineProps<{ chartId: string }>();
</script>

<template>
  <td :class="[fa.solid, $style.cell]" @click="showBuffer(`XIT FINCH ${chartId}`)">
    {{ '\uf201' }}
  </td>
</template>

<style module>
.cell {
  padding-left: 6px;
  padding-right: 6px;
  width: 0;
  cursor: pointer;
}
</style>
