<script setup lang="ts">
const {
  max = 100,
  min = 0,
  step = 1,
} = defineProps<{ max?: number; min?: number; step?: number }>();

const model = defineModel<number>();
</script>

<template>
  <div>
    <input v-model="model" :class="$style.input" type="range" :min="min" :max="max" :step="step" />
  </div>
</template>

<style module>
.input {
  appearance: none;
  -webkit-appearance: none;
  margin: 18px 0;
  width: 100%;
  background: transparent;
}

.input:focus {
  outline: none;
}

.input::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  cursor: pointer;
  background-color: #283743;
}

.input::-moz-range-track {
  width: 100%;
  height: 6px;
  cursor: pointer;
  background-color: #283743;
}

.input::-webkit-slider-thumb {
  margin-left: 0;
  margin-top: -4px;
  width: 14px;
  height: 14px;
  cursor: pointer;
  border-radius: 50%;
  border: solid 2px #fbd380;
  background-color: #262626;
  z-index: 2;
  appearance: none;
  -webkit-appearance: none;
}

.input::-moz-range-thumb {
  margin-left: 0;
  margin-top: -4px;
  width: 14px;
  height: 14px;
  cursor: pointer;
  border-radius: 50%;
  border: solid 2px #fbd380;
  background-color: #262626;
  z-index: 2;
  appearance: none;
  -webkit-appearance: none;
}
</style>
