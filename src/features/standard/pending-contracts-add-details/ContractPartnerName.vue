<script setup lang="ts">
import { computed } from 'vue';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import PrunLink from '@src/components/PrunLink.vue';

const props = defineProps({
  contractLocalId: {
    type: String,
    required: true,
  },
});

const contract = computed(() => contractsStore.getByLocalId(props.contractLocalId));
const partner = computed(() => contract.value?.partner);
const code = computed(() => partner.value?.code);
const countryCode = computed(() => partner.value?.countryCode);
const name = computed(() => partner.value?.name);

const command = computed(() =>
  countryCode.value ? `FA ${countryCode.value}` : `CO ${code.value}`,
);
</script>

<template>
  <div v-if="!contract" :class="$style.label">Unknown</div>
  <PrunLink v-else :class="$style.label" :command="command">
    {{ name ?? code }}
  </PrunLink>
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
