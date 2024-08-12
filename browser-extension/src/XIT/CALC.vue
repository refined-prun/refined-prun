<script lang="ts">
import xit from './xit-registry';
import features from '@src/feature-registry';
import CALC from '@src/XIT/CALC.vue';

function init() {
  xit.add({
    command: ['CALC', 'CALCULATOR'],
    name: 'CALCULATOR',
    vueComponent: CALC,
  });
}

features.add({
  id: 'xit-calc',
  init,
});

export default {};
</script>

<template>
  <iframe
    src="https://www.desmos.com/scientific"
    width="100%"
    height="100%"
    :style="{ borderWidth: 0 }" />
</template>
