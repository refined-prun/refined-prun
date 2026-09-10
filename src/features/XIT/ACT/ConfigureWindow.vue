<script setup lang="ts">
import { ActionPackageConfig } from '@src/features/XIT/ACT/shared-types';
import SectionHeader from '@src/components/SectionHeader.vue';
import { act } from '@src/features/XIT/ACT/act-registry';

const { pkg, config } = defineProps<{
  pkg: UserData.ActionPackageData;
  config: ActionPackageConfig;
}>();

interface Block {
  name: string;
  component: Component;
  data: unknown;
  config: unknown;
}

const blocks = computed(() => {
  const blocks = [] as Block[];
  for (const group of pkg.groups) {
    const info = act.getMaterialGroupInfo(group.type);
    if (!info || !info.configureComponent || !info.needsConfigure?.(group)) {
      continue;
    }
    const name = group.name!;
    let groupConfig = config.materialGroups[name];
    if (!groupConfig) {
      continue;
    }
    blocks.push({
      name: `[${name}]: ${info.type} Material Group`,
      component: info.configureComponent,
      data: group,
      config: groupConfig,
    });
  }
  for (const action of pkg.actions) {
    const info = act.getActionInfo(action.type);
    if (!info || !info.configureComponent || !info.needsConfigure?.(action)) {
      continue;
    }
    const name = action.name!;
    let actionConfig = config.actions[name];
    if (!actionConfig) {
      continue;
    }
    blocks.push({
      name: `[${name}]: ${info.type} Action`,
      component: info.configureComponent,
      data: action,
      config: actionConfig,
    });
  }
  return blocks;
});
</script>

<template>
  <div :class="$style.config">
    <template v-for="block in blocks" :key="block.name">
      <SectionHeader :class="$style.sectionHeader">{{ block.name }}</SectionHeader>
      <component :is="block.component" :data="block.data" :config="block.config" />
    </template>
  </div>
</template>

<style module>
.config {
  margin-top: 5px;
  margin-left: 4px;
  overflow-y: scroll;
  background-color: #23282b;
  border: 1px solid #2b485a;
  scrollbar-width: none;
}

.sectionHeader {
  margin-top: 2px;
  margin-bottom: 2px;
  margin-right: 4px;
}
</style>
