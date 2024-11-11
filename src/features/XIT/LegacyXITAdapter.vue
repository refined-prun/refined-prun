<script setup lang="ts">
import { ref, PropType, onMounted } from 'vue';
import { XITModule } from '@src/features/XIT/xit-registry';

const props = defineProps({
  module: {
    type: Function as PropType<(container: HTMLDivElement) => XITModule>,
    required: true,
  },
});

const container = ref(undefined);

onMounted(() => {
  const xitObject = props.module(container.value! as HTMLDivElement);
  xitObject.create_buffer();
});
</script>

<template>
  <div ref="container" :style="{ height: '100%', flexGrow: 1, paddingTop: '4px' }" />
</template>
