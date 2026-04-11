<script setup lang="ts">
import { PlanetBurn } from '@src/core/burn';
import MaterialRow from '@src/features/XIT/MATIO/MaterialRow.vue';
import { getSortedTickers, MatioPricing } from '@src/features/XIT/MATIO/utils';

const { section, pricing } = defineProps<{
  section: PlanetBurn;
  pricing: MatioPricing;
}>();

const sorted = computed(() => getSortedTickers(section));
</script>

<template>
  <MaterialRow
    v-for="material in sorted"
    :key="material.id"
    :flow="section.burn[material.ticker]"
    :material="material"
    :pricing="pricing" />
</template>
