<script setup lang="ts">
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { prunAtob } from '@src/infrastructure/prun-ui/base64';
import { isValidUrl } from '@src/utils/is-valid-url';
import { shortcuts } from '@src/features/XIT/WEB/shortcuts';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { useXitCommand } from '@src/hooks/use-xit-command';

const command = useXitCommand();
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

const loading = ref(true);
</script>

<template>
  <div v-if="!url">Invalid parameters!</div>
  <div v-else-if="!isValidUrl(url)">Url {{ url }} is invalid!</div>
  <template v-else>
    <LoadingSpinner v-if="loading" />
    <iframe
      :src="url"
      allow="clipboard-write"
      width="100%"
      height="99.65%"
      style="border-width: 0"
      @load="loading = false" />
  </template>
</template>
