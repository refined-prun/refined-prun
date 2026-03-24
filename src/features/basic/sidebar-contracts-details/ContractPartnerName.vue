<script setup lang="ts">
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import PrunLink from '@src/components/PrunLink.vue';
import { isFactionContract } from '@src/features/XIT/CONTS/utils';

const { contractLocalId } = defineProps<{ contractLocalId: string | null }>();

const contract = computed(() => contractsStore.getByLocalId(contractLocalId));
</script>

<template>
  <div v-if="!contract" :class="$style.label">Unknown</div>
  <PrunLink
    v-else-if="isFactionContract(contract)"
    :command="`FA ${contract.partner.countryCode}`"
    :class="$style.label">
    {{ contract.partner.name }}
  </PrunLink>
  <PrunLink
    v-else-if="contract.partner.name"
    :command="`CO ${contract.partner.code}`"
    :class="$style.label">
    {{ contract.partner.name }}
  </PrunLink>
  <PrunLink
    v-else-if="contract.partner.code"
    :command="`CO ${contract.partner.code}`"
    :class="$style.label" />
  <div v-else-if="contract.partner.currency" :class="$style.label">Planetary Government</div>
  <div v-else :class="$style.label">Unknown</div>
</template>

<style module>
.label {
  flex-grow: 1;
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
}
</style>
