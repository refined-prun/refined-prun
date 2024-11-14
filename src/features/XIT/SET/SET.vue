<script setup lang="ts">
import Tabs, { Tab } from '@src/components/Tabs.vue';
import GAME from '@src/features/XIT/SET/GAME.vue';
import FEAT from '@src/features/XIT/SET/FEAT.vue';
import FIN from '@src/features/XIT/SET/FIN.vue';
import { useXitParameters } from '@src/hooks/use-xit-parameters';

const tabs: Tab[] = [
  {
    id: 'GAME',
    label: 'Gameplay',
    component: GAME,
  },
  {
    id: 'FEAT',
    label: 'Features',
    component: FEAT,
  },
  {
    id: 'FIN',
    label: 'Financial',
    component: FIN,
  },
];

const parameters = useXitParameters();
const parameter = parameters[0];

const activeTab = shallowRef(tabs.find(x => x.id === parameter?.toUpperCase()) ?? tabs[0]);
</script>

<template>
  <Tabs v-model="activeTab" :tabs="tabs" />
</template>
