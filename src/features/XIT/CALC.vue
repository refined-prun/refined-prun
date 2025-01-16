<script setup lang="ts">
import LoadingSpinner from '@src/components/LoadingSpinner.vue';

const loading = ref(true);
</script>

<template>
  <LoadingSpinner v-if="loading" :class="$style.loading" />
  <iframe
    src="https://refined-prun.github.io/xit-calc/"
    width="100%"
    height="100%"
    :class="$style.calc"
    @load="loading = false" />
</template>

<style module>
.loading {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.calc {
  border-width: 0;
  width: 100%;
  height: calc(100% - 6px);
  padding-left: 6px;
  padding-top: 6px;
}
</style>
