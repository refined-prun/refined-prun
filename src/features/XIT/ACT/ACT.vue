<script setup lang="ts">
import { Execute } from '@src/features/XIT/ACT/Execute';
import { useXitParameters } from '@src/hooks/use-xit-parameters';

const container = useTemplateRef<HTMLDivElement>('container');

const parameters = useXitParameters();
parameters.unshift('ACT');

onMounted(() => {
  const xitObject = new Execute(container.value, parameters);
  xitObject.create_buffer();
});
</script>

<template>
  <div ref="container" :style="{ height: '100%', flexGrow: 1, paddingTop: '4px' }" />
</template>
