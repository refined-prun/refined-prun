<script setup lang="ts">
import fa from '@src/utils/font-awesome.module.css';

defineProps({
  icon: {
    type: String,
    required: true,
  },
  onClick: {
    type: Function as PropType<() => void>,
    default: () => {},
  },
});
</script>

<template>
  <button :class="[PrunCss.TileControls.control, fa.solid, $style.button]" @click="onClick">
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
