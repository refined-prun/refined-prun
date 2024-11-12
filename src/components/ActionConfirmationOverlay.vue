<script setup lang="ts">
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
  <div :class="[C.ActionConfirmationOverlay.container, C.ActionFeedback.overlay]">
    <div
      :class="[
        C.ActionConfirmationOverlay.message,
        C.ActionFeedback.message,
        C.fonts.fontRegular,
        C.type.typeLarger,
      ]">
      <span
        :class="[
          C.ActionConfirmationOverlay.message,
          C.ActionFeedback.message,
          C.fonts.fontRegular,
          C.type.typeLarger,
        ]"
        >Confirmation required</span
      >
      <span
        :class="[
          C.ActionConfirmationOverlay.text,
          C.ActionFeedback.text,
          C.fonts.fontRegular,
          C.type.typeRegular,
        ]"
        >{{ message }}</span
      >
      <div :class="[C.ActionConfirmationOverlay.buttons]">
        <PrunButton neutral @click="onClose">Cancel</PrunButton>
        <PrunButton danger @click="onConfirm">{{ confirmLabel }}</PrunButton>
      </div>
    </div>
  </div>
</template>
