<script setup lang="ts">
import PrunLink from '@src/components/PrunLink.vue';
import {
  canAcceptContract,
  canPartnerAcceptContract,
  isFactionContract,
} from '@src/features/XIT/CONTS/utils';
import fa from '@src/utils/font-awesome.module.css';
import coloredValue from '@src/infrastructure/prun-ui/css/colored-value.module.css';

const { contract } = defineProps<{ contract: PrunApi.Contract }>();

const canAccept = computed(() => canAcceptContract(contract));

const canPartnerAccept = computed(() => canPartnerAcceptContract(contract));

const linkStyle = computed(() => ({
  display: isFactionContract(contract) ? 'inline' : 'block',
}));
</script>

<template>
  <PrunLink :command="`CONT ${contract.localId}`" :style="linkStyle">
    {{ contract.name || contract.localId }}
    <span v-if="canAccept" :class="[fa.solid, coloredValue.warning]">{{ '\uf0e0' }}</span>
    <span v-if="canPartnerAccept" :class="[fa.solid, coloredValue.warning]">{{ '\uf1d8' }}</span>
  </PrunLink>
</template>
