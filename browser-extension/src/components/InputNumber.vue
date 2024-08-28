<script setup lang="ts">
import PrunCss from '@src/prun-ui/prun-css';

const model = defineModel({
  type: Number,
});
</script>

<template>
  <div :class="PrunCss.forms.input">
    <input v-model="model" type="number" />
  </div>
</template>
