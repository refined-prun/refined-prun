<script setup lang="ts">
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import ActionPackageList from '@src/features/XIT/ACT/ActionPackageList.vue';
import ActionPackageEditor from '@src/features/XIT/ACT/EditActionPackage.vue';
import { userData } from '@src/store/user-data';
import ExecuteActionPackage from '@src/features/XIT/ACT/ExecuteActionPackage.vue';

const parameters = useXitParameters();
parameters.unshift('ACT');

let pkgName = undefined as string | undefined;
const edit = parameters[1]?.toLowerCase() === 'gen' || parameters[1]?.toLowerCase() === 'edit';
if (edit) {
  pkgName = parameters.slice(2).join(' ');
}
const run = parameters[1] !== undefined && !edit;
if (run) {
  pkgName = parameters.slice(1).join(' ');
}

const pkg = computed(() => userData.actionPackages.find(x => x.global.name === pkgName));
</script>

<template>
  <ActionPackageList v-if="parameters.length === 1" />
  <div v-else-if="!pkg">Action package "{{ pkgName }}" not found.</div>
  <ActionPackageEditor v-else-if="edit" :pkg="pkg" />
  <ExecuteActionPackage v-else :pkg="pkg" />
</template>
