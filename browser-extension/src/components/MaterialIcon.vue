<script setup lang="ts">
import PrunCss from '@src/prun-ui/prun-css';
import { showBuffer } from '@src/util';
import { computed } from 'vue';
import { useCssModule } from 'vue';
import ColoredIcon from '@src/components/ColoredIcon.vue';
import { materialsStore } from '@src/prun-api/data/materials';
import { materialCategoriesStore } from '@src/prun-api/data/material-categories';
import { getMaterialNameByTicker } from '@src/prun-ui/material-names';

const props = defineProps({
  ticker: {
    type: String,
    required: true,
  },
  small: Boolean,
  amount: {
    type: Number,
    required: false,
    default: undefined,
  },
});

const $style = useCssModule();

const material = computed(() => materialsStore.getByTicker(props.ticker));
const materialCategory = computed(() => materialCategoriesStore.getById(material.value?.category));

const name = computed(() => getMaterialNameByTicker(material.value?.ticker) ?? 'Unknown');
const colors = computed(() => {
  const colors = categoryColors[materialCategory.value?.name ?? ''] ?? categoryColors['unknown'];
  return {
    background: colors[0],
    color: colors[1],
  };
});

const containerClasses = computed(() => [
  PrunCss.MaterialIcon.container,
  $style.container,
  {
    [$style.small]: props.small,
    [$style.large]: !props.small,
  },
]);

const amountClasses = [
  PrunCss.MaterialIcon.indicator,
  PrunCss.MaterialIcon.neutral,
  PrunCss.MaterialIcon.typeVerySmall,
];

const onClick = () => showBuffer(`MAT ${props.ticker.toUpperCase()}`);

const categoryColors = {
  'electronic devices': [
    'linear-gradient(135deg, rgb(86, 20, 147), rgb(111, 45, 172))',
    'rgb(213, 147, 255)',
  ],
  'construction prefabs': [
    'linear-gradient(135deg, rgb(15, 30, 98), rgb(40, 55, 123))',
    'rgb(142, 157, 225)',
  ],
  'electronic systems': [
    'linear-gradient(135deg, rgb(51, 26, 76), rgb(76, 51, 101))',
    'rgb(178, 153, 203)',
  ],
  'medical equipment': [
    'linear-gradient(135deg, rgb(85, 170, 85), rgb(110, 195, 110))',
    'rgb(212, 255, 212)',
  ],
  'construction parts': [
    'linear-gradient(135deg, rgb(41, 77, 107), rgb(66, 102, 132))',
    'rgb(168, 204, 234)',
  ],
  'ship engines': [
    'linear-gradient(135deg, rgb(153, 41, 0), rgb(178, 66, 25))',
    'rgb(255, 168, 127)',
  ],
  'ship parts': [
    'linear-gradient(135deg, rgb(153, 99, 0), rgb(178, 124, 25))',
    'rgb(255, 226, 127)',
  ],
  metals: ['linear-gradient(135deg, rgb(54, 54, 54), rgb(79, 79, 79))', 'rgb(181, 181, 181)'],
  'consumables (luxury)': [
    'linear-gradient(135deg, rgb(136, 24, 39), rgb(161, 49, 64))',
    'rgb(255, 151, 166)',
  ],
  'agricultural products': [
    'linear-gradient(135deg, rgb(92, 18, 18), rgb(117, 43, 43))',
    'rgb(219, 145, 145)',
  ],
  ores: ['linear-gradient(135deg, rgb(82, 87, 97), rgb(107, 112, 122))', 'rgb(209, 214, 224)'],
  gases: ['linear-gradient(135deg, rgb(0, 105, 107), rgb(25, 130, 132))', 'rgb(127, 232, 234)'],
  'ship shields': [
    'linear-gradient(135deg, rgb(224, 131, 0), rgb(249, 156, 25))',
    'rgb(230 230,127)',
  ],
  alloys: ['linear-gradient(135deg, rgb(123, 76, 30), rgb(148, 101, 55))', 'rgb(250, 203, 157)'],
  chemicals: ['linear-gradient(135deg, rgb(183, 46, 91), rgb(208, 71, 116))', 'rgb(255, 173, 218)'],
  'software components': [
    'linear-gradient(135deg, rgb(136, 121, 47), rgb(161, 146, 72))',
    'rgb(255, 248, 174)',
  ],
  'electronic pieces': [
    'linear-gradient(135deg, rgb(119, 82, 189), rgb(144, 107, 214))',
    'rgb(246, 209, 255)',
  ],
  elements: ['linear-gradient(135deg, rgb(61, 46, 32), rgb(86, 71, 57))', 'rgb(188, 173, 159)'],
  minerals: ['linear-gradient(135deg, rgb(153, 113, 73), rgb(178, 138, 98))', 'rgb(255, 240, 200)'],
  'unit prefabs': [
    'linear-gradient(135deg, rgb(29, 27, 28), rgb(54, 52, 53))',
    'rgb(156, 154, 155)',
  ],
  liquids: [
    'linear-gradient(135deg, rgb(114, 164, 202), rgb(139, 189, 227))',
    'rgb(241, 255, 255)',
  ],
  'energy systems': [
    'linear-gradient(135deg, rgb(21, 62, 39), rgb(46, 87, 64))',
    'rgb(148, 189, 166)',
  ],
  drones: ['linear-gradient(135deg, rgb(140, 52, 18), rgb(165, 77, 43))', 'rgb(255, 179, 145)'],
  'electronic parts': [
    'linear-gradient(135deg, rgb(91, 46, 183), rgb(116, 71, 208))',
    'rgb(218, 173, 255)',
  ],
  textiles: ['linear-gradient(135deg, rgb(82, 90, 33), rgb(107, 115, 58))', 'rgb(209, 217, 160)'],
  'construction materials': [
    'linear-gradient(135deg, rgb(24, 91, 211), rgb(49, 116, 236))',
    'rgb(151, 218, 255)',
  ],
  'software tools': [
    'linear-gradient(135deg, rgb(129, 98, 19), rgb(154, 123, 44))',
    'rgb(255, 255, 146)',
  ],
  plastics: ['linear-gradient(135deg, rgb(121, 31, 60), rgb(146, 56, 85))', 'rgb(248, 158, 187)'],
  'consumables (basic)': [
    'linear-gradient(135deg, rgb(149, 46, 46), rgb(174, 71, 71))',
    'rgb(255, 173, 173)',
  ],
  fuels: ['linear-gradient(135deg, rgb(30, 123, 30), rgb(55, 148, 55))', 'rgb(157, 250, 157)'],
  'software systems': [
    'linear-gradient(135deg, rgb(60, 53, 5), rgb(85, 78, 30))',
    'rgb(187, 180, 132)',
  ],
  'ship kits': [
    'linear-gradient(135deg, rgb(154, 84, 0), rgb(178, 109, 25))',
    'rgb(255, 211, 127)',
  ],
  utility: [
    'linear-gradient(135deg, rgb(161, 148, 136), rgb(186, 173, 161))',
    'rgb(255, 255, 255)',
  ],
  unknown: ['#ff00ff', '#00ffff'],
};
</script>

<template>
  <div :class="containerClasses">
    <ColoredIcon
      :label="ticker"
      :title="name"
      :background="colors.background"
      :color="colors.color"
      @click="onClick" />
    <div v-if="amount" :class="PrunCss.MaterialIcon.indicatorContainer" @click="onClick">
      <div :class="amountClasses">{{ amount }}</div>
    </div>
  </div>
</template>

<style module>
.container {
  cursor: pointer;
}

.large {
  height: 48px;
  width: 48px;
}

.large div.ColoredIcon__container___djaR4r2 {
  height: 48px;
  width: 48px;
  font-size: 15.84px;
  cursor: pointer;
}

.small {
  height: 32px;
  width: 32px;
}
</style>
