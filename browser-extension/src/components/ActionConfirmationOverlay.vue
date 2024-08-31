<script setup lang="ts">
import PrunCss from '@src/prun-ui/prun-css';
import { PropType } from 'vue';

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
        <button
          :class="[PrunCss.Button.neutral, PrunCss.Button.btn]"
          type="button"
          @click="onClose">
          <span>Cancel</span>
        </button>
        <button
          :class="[PrunCss.Button.danger, PrunCss.Button.btn]"
          type="button"
          @click="onConfirm">
          <span>{{ confirmLabel }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
