<script setup lang="ts">
import { PropType } from 'vue';
import PrunLink from '@src/components/PrunLink.vue';
import { TextColors } from '@src/Style';
import { isFactionContract } from '@src/features/XIT/CONTS/utils';

defineProps({
  contract: {
    type: Object as PropType<PrunApi.Contract>,
    required: true,
  },
});
</script>

<template>
  <PrunLink v-if="isFactionContract(contract)" :command="`FA ${contract.partner.countryCode}`">
    <span :style="{ color: TextColors.Yellow, fontWeight: 'bold' }" title="Faction Contract">
      ✦
    </span>
    {{ contract.partner.name }}
  </PrunLink>
  <PrunLink v-else-if="contract.partner.name" :command="`CO ${contract.partner.code}`">
    {{ contract.partner.name }}
  </PrunLink>
  <PrunLink v-else :command="`CO ${contract.partner.code}`" />
</template>
