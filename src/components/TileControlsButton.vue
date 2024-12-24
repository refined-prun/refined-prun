<script setup lang="ts">
import fa from '@src/utils/font-awesome.module.css';

const { onClick = () => {}, marginTop = 3 } = defineProps<{
  icon: string;
  marginTop?: number;
  onClick?: () => void;
}>();
</script>

<template>
  <button
    :class="[C.TileControls.control, fa.solid, $style.button]"
    :style="{ marginTop: marginTop + 'px' }"
    @click="onClick">
    {{ icon }}
  </button>
</template>

<style module>
.button {
  margin-top: 3px;
  padding: 3px;
  width: 18px;
  height: 18px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
}
</style>
