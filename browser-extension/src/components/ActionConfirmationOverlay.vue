<script setup lang="ts">
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { PropType } from 'vue';
import PrunButton from '@src/components/PrunButton.vue';

defineProps({
  message: {
    type: String,
    required: true,
  },
  confirmLabel: {
    type: String,
    default: 'Confirm',
  },
  onConfirm: {
    type: Function as PropType<() => void>,
    required: true,
  },
  onClose: {
    type: Function as PropType<() => void>,
    required: true,
  },
});
</script>

<template>
  <div :class="[PrunCss.ActionConfirmationOverlay.container, PrunCss.ActionFeedback.overlay]">
    <div
      :class="[
        PrunCss.ActionConfirmationOverlay.message,
        PrunCss.ActionFeedback.message,
        PrunCss.fonts.fontRegular,
        PrunCss.type.typeLarger,
      ]">
      <span
        :class="[
          PrunCss.ActionConfirmationOverlay.message,
          PrunCss.ActionFeedback.message,
          PrunCss.fonts.fontRegular,
          PrunCss.type.typeLarger,
        ]"
        >Confirmation required</span
      >
      <span
        :class="[
          PrunCss.ActionConfirmationOverlay.text,
          PrunCss.ActionFeedback.text,
          PrunCss.fonts.fontRegular,
          PrunCss.type.typeRegular,
        ]"
        >{{ message }}</span
      >
      <div :class="[PrunCss.ActionConfirmationOverlay.buttons]">
        <PrunButton neutral @click="onClose">Cancel</PrunButton>
        <PrunButton danger @click="onConfirm">{{ confirmLabel }}</PrunButton>
      </div>
    </div>
  </div>
</template>
