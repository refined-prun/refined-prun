<script setup lang="ts">
const { props = {} } = defineProps<{
  child: Component;
  onClose: () => void;
  props?: object | null;
}>();
</script>

<template>
  <div :class="C.Overlay.overlay">
    <div :class="C.Overlay.close" @click="onClose" />
    <div :class="C.Overlay.children">
      <Component :is="child" v-bind="props" @close="onClose" />
    </div>
    <div :class="C.Overlay.close" @click="onClose" />
  </div>
</template>
