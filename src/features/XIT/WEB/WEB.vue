<script setup lang="ts">
import { useXitParameters } from '@src/hooks/useXitParameters';
import { inject } from 'vue';
import { prunAtob } from '@src/infrastructure/prun-ui/base64';
import xit from '@src/features/XIT/xit-registry';
import { isValidUrl, shortcuts } from '@src/features/XIT/WEB/shared';

const command = inject(xit.command)!;
const parameters = useXitParameters();
const url = getUrl();

function getUrl() {
  const applyShortcut = shortcuts.get(command.toUpperCase());
  if (applyShortcut) {
    return applyShortcut(parameters);
  }
  let url = parameters[1];
  if (isValidUrl(url)) {
    return url;
  }
  try {
    return prunAtob(parameters.join(''));
  } catch {
    return undefined;
  }
}
</script>

<template>
  <div v-if="!url">Invalid parameters!</div>
  <div v-else-if="!isValidUrl(url)">Url {{ url }} is invalid!</div>
  <iframe v-else :src="url" width="100%" height="100%" style="border-width: 0" />
</template>
