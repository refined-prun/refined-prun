<script setup lang="ts">
import PrunLink from '@src/components/PrunLink.vue';
import { isFactionContract } from '@src/features/XIT/CONTS/utils';

const { contract } = defineProps<{ contract: PrunApi.Contract }>();

const linkStyle = computed(() => ({
  display: isFactionContract(contract) ? 'inline' : 'block',
}));
</script>

<template>
  <PrunLink :command="`CONT ${contract.localId}`" :style="linkStyle">
    {{ contract.name || contract.localId }}
  </PrunLink>
</template>
