<script setup lang="ts">
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { userData } from '@src/store/user-data';

const textClasses = [C.Frame.toggleLabel, C.fonts.fontRegular, C.type.typeRegular];

const sliverClasses = [C.Frame.toggleIndicator, C.Frame.toggleIndicatorSecondary];
</script>

<template>
  <div>
    <div
      v-for="(button, i) in userData.settings.sidebar"
      :key="i"
      :class="C.Frame.toggle"
      @click="() => showBuffer(button[1])">
      <span :class="textClasses">{{ button[0] }}</span>
      <div :class="sliverClasses" />
    </div>
  </div>
</template>
