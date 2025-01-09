<script setup lang="ts">
import { Execute } from '@src/features/XIT/ACT/Execute';
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import ActionPackageList from '@src/features/XIT/ACT/ActionPackageList.vue';

const container = useTemplateRef<HTMLDivElement>('container');

const parameters = useXitParameters();
parameters.unshift('ACT');

onMounted(() => {
  if (!container.value) {
    return;
  }
  const xitObject = new Execute(container.value, parameters);
  xitObject.create_buffer();
});
</script>

<template>
  <ActionPackageList v-if="parameters.length === 1" />
  <div v-else ref="container" :style="{ height: '100%', flexGrow: 1, paddingTop: '4px' }" />
</template>
