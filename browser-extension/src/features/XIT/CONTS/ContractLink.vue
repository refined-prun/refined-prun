<script setup lang="ts">
import { computed, PropType } from 'vue';
import PrunLink from '@src/components/PrunLink.vue';
import { canAcceptContract, isFactionContract } from '@src/features/XIT/CONTS/utils';
import fa from '@src/utils/font-awesome.module.css';

const props = defineProps({
  contract: {
    type: Object as PropType<PrunApi.Contract>,
    required: true,
  },
});

const canAccept = computed(() => canAcceptContract(props.contract));

const linkStyle = computed(() => ({
  display: isFactionContract(props.contract) ? 'inline' : 'block',
}));
</script>

<template>
  <PrunLink :command="`CONT ${contract.localId}`" :style="linkStyle">
    {{ contract.name || contract.localId }}
    <span v-if="canAccept" :class="[fa.solid, $style.yellow]">{{ '\uf0e0' }}</span>
  </PrunLink>
</template>

<style module>
.yellow {
  color: #f7a700;
}
</style>
