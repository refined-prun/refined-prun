<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';

const {
  status,
  message,
  confirmLabel = L.ActionComponent.action.confirm(),
  onConfirm = () => {},
  onDismiss = () => {},
} = defineProps<{
  status: 'confirmation' | 'error' | 'progress' | 'success';
  message?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  onDismiss?: () => void;
}>();

const feedbackClass = computed(() => {
  if (status === 'success') {
    return C.ActionFeedback.success;
  }
  if (status === 'error') {
    return C.ActionFeedback.error;
  }
  return C.ActionFeedback.progress;
});

const feedbackMessage = computed(() => {
  if (message !== undefined) {
    return message;
  }
  if (status === 'success') {
    return L.ActionFeedback.success();
  }
  if (status === 'progress') {
    return L.ActionFeedback.inprogress();
  }
  return status;
});

function onFeedbackClick(event: MouseEvent) {
  if (status === 'progress') {
    return;
  }
  event.preventDefault();
  onDismiss();
}
</script>

<template>
  <div
    v-if="status === 'confirmation'"
    :class="[C.ActionConfirmationOverlay.container, C.ActionFeedback.overlay]">
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
        ]">
        {{ L.ActionFeedback.confirmation() }}
      </span>
      <span
        :class="[
          C.ActionConfirmationOverlay.text,
          C.ActionFeedback.text,
          C.fonts.fontRegular,
          C.type.typeRegular,
        ]">
        {{ message }}
      </span>
      <div :class="C.ActionConfirmationOverlay.buttons">
        <PrunButton neutral @click="onDismiss">
          {{ L.ActionFeedback.cancel() }}
        </PrunButton>
        <PrunButton danger @click="onConfirm">{{ confirmLabel }}</PrunButton>
      </div>
    </div>
  </div>
  <div v-else :class="[feedbackClass, C.ActionFeedback.overlay]" @click="onFeedbackClick">
    <span :class="[C.ActionFeedback.message, C.fonts.fontRegular, C.type.typeLarger]">
      {{ feedbackMessage }}
      <span v-if="status !== 'progress'" :class="[C.ActionFeedback.dismiss, C.type.typeSmall]">
        {{ L.ActionFeedback.dismiss() }}
      </span>
    </span>
  </div>
</template>
