<script setup lang="ts">
import ExecuteActionPackage from '@src/features/XIT/ACT/ExecuteActionPackage.vue';
import { stagedGovBurn } from '@src/features/XIT/GOVBURN/staged';
import { useMinBufferHeight } from '@src/hooks/use-min-buffer-height';

const pkg = stagedGovBurn.value?.pkg;

useMinBufferHeight();
</script>

<template>
  <div v-if="!pkg">Nothing staged. Open XIT GOVBURNACT and press EXECUTE.</div>
  <ExecuteActionPackage v-else :pkg="pkg" />
</template>
