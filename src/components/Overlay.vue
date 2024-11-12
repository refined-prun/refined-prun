<script setup lang="ts">
defineProps({
  child: {
    type: Object as PropType<Component>,
    required: true,
  },
  props: {
    type: Object,
    default: () => {},
  },
  onClose: {
    type: Function as PropType<() => void>,
    required: true,
  },
});
</script>

<template>
  <div :class="C.Overlay.overlay">
    <div :class="[C.Overlay.background, C.Overlay.overlay]">
      <div :class="C.Overlay.close" @click="onClose" />
      <div :class="C.Overlay.children">
        <Component :is="child" v-bind="props" @close="onClose" />
      </div>
      <div :class="C.Overlay.close" @click="onClose" />
    </div>
  </div>
</template>
