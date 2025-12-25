<script setup lang="ts">
import RangeInput from '@src/components/forms/RangeInput.vue';
import { percent0 } from '@src/utils/format.ts';
import { userData } from '@src/store/user-data.ts';
import { playAudio } from '@src/infrastructure/prun-ui/audio-interceptor.ts';

const inputText = ref(userData.settings.audioVolume);
watch(inputText, x => {
  const parsed = typeof x === 'number' ? x : parseFloat(x);
  if (isFinite(parsed)) {
    userData.settings.audioVolume = parsed;
  }
});
</script>

<template>
  <div :class="[C.RadioItem.value, C.fonts.fontRegular, C.type.typeSmall, $style.label]">
    Audio Volume: {{ percent0(userData.settings.audioVolume) }}
  </div>
  <RangeInput
    v-model="inputText"
    :class="$style.slider"
    :min="0"
    :max="1"
    :step="0.01"
    :on-change="playAudio"
    @click="playAudio" />
</template>

<style module>
.label {
  margin-top: 8px;
  pointer-events: none;
}

.slider {
  margin-top: -6px;
  margin-bottom: -10px;
  padding-right: 6px;
}
</style>
