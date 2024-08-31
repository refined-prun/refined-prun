<script setup lang="ts">
import { showBuffer } from '@src/util';
import { settings } from '@src/store/settings';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';

const buttons = settings.sidebar;

const textClasses = [
  PrunCss.Frame.toggleLabel,
  PrunCss.fonts.fontRegular,
  PrunCss.type.typeRegular,
];

const sliverClasses = [PrunCss.Frame.toggleIndicator, PrunCss.Frame.toggleIndicatorSecondary];
</script>

<template>
  <div>
    <div
      v-for="(button, i) in buttons"
      :key="i"
      :class="PrunCss.Frame.toggle"
      @click="() => showBuffer(button[1])">
      <span :class="textClasses">{{ button[0] }}</span>
      <div :class="sliverClasses" />
    </div>
  </div>
</template>
