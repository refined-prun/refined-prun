<script setup lang="ts">
import ExecuteActionPackage from '@src/features/XIT/ACT/ExecuteActionPackage.vue';
import { stagedDispatch } from '@src/features/XIT/DSP/staged';

const pkg = stagedDispatch.value?.pkg;
</script>

<template>
  <div v-if="!pkg">Nothing staged. Open XIT DSP and press EXECUTE.</div>
  <ExecuteActionPackage v-else :pkg="pkg" />
</template>
