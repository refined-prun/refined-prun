<script lang="ts">
import xit from './xit-registry';
import CALC from '@src/features/XIT/CALC.vue';

xit.add({
  command: ['CALC', 'CALCULATOR'],
  name: 'CALCULATOR',
  component: () => CALC,
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
