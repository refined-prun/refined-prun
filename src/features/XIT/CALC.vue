<script setup lang="ts">
import LoadingSpinner from '@src/components/LoadingSpinner.vue';

const loading = ref(true);
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <iframe
    src="https://refined-prun.github.io/xit-calc/"
    width="100%"
    height="100%"
    :class="$style.calc"
    @load="loading = false" />
</template>

<style module>
.calc {
  border-width: 0;
  height: calc(100% - 3px);
  padding-left: 6px;
  padding-top: 3px;
}
</style>
