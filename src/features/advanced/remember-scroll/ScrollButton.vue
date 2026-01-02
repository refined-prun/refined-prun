<script setup lang="ts">
import { Scroll } from '@src/features/advanced/remember-scroll/tile-state';
import TileControlsButton from '@src/components/TileControlsButton.vue';

const { currentScroll, maxScroll, savedScroll, scrollTo, saveScroll } = defineProps<{
  currentScroll: Scroll;
  maxScroll: Scroll;
  savedScroll?: Scroll;
  scrollTo?: (scroll: Scroll) => void;
  saveScroll?: (scroll: Scroll | undefined) => void;
  hidden?: boolean;
}>();

const saveCurrentScroll = () => {
  saveScroll?.(currentScroll);
};
const unsaveScroll = () => {
  saveScroll?.(undefined);
};
const scrollToSaved = () => {
  if (!savedScroll) {
    return;
  }
  scrollTo?.(savedScroll);
};

function approximateEquality(a: number, b: number, within: number = 1) {
  return Math.abs(a - b) < within;
}

const buttonState = computed(() => {
  // It is possible for a scroll value to be negative; I don't think this occurs in PRUN, but I'm not sure how to consider it here.
  if (savedScroll !== undefined) {
    if (
      (approximateEquality(currentScroll.top, maxScroll.top) &&
        savedScroll.top > currentScroll.top) ||
      (approximateEquality(currentScroll.left, maxScroll.left) &&
        savedScroll.left > currentScroll.left)
    ) {
      // Icon is 'location-pin-lock' if at scroll bound and saved scroll is unreachable, indicating it can be unlocked.
      return {
        icon: '\ue51f',
        onClick: unsaveScroll,
      };
    }
    if (
      approximateEquality(savedScroll.left, currentScroll.left) &&
      approximateEquality(savedScroll.top, currentScroll.top)
    ) {
      // Icon is 'location-pin-lock' if at saved scroll, indicating it can be unlocked.
      return {
        icon: '\ue51f',
        onClick: unsaveScroll,
      };
    } else {
      // Icon is 'location-dot' if the scroll is saved but not at saved scroll, indicating that the button will go to the saved scroll.
      return {
        icon: '\uf3c5',
        onClick: scrollToSaved,
      };
    }
  } else {
    // Icon is 'computer-mouse' if the scroll is not saved, indicating that it can be saved.
    return {
      icon: '\uf8cc',
      onClick: saveCurrentScroll,
    };
  }
});
</script>

<template>
  <TileControlsButton v-show="!hidden" :icon="buttonState.icon" :on-click="buttonState.onClick" />
</template>

<style module></style>
