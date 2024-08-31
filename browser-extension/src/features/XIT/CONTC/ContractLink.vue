<script setup lang="ts">
import { computed, PropType } from 'vue';
import PrunLink from '@src/components/PrunLink.vue';
import { isFactionContract } from '@src/features/XIT/CONTS/utils';

const props = defineProps({
  contract: {
    type: Object as PropType<PrunApi.Contract>,
    required: true,
  },
});

const linkStyle = computed(() => ({
  display: isFactionContract(props.contract) ? 'inline' : 'block',
}));
</script>

<template>
  <PrunLink :command="`CONT ${contract.localId}`" :style="linkStyle">
    {{ contract.name || contract.localId }}
  </PrunLink>
</template>
