<script setup lang="ts">
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { prunAtob } from '@src/infrastructure/prun-ui/base64';
import { isValidUrl } from '@src/utils/is-valid-url';
import { shortcuts } from '@src/features/XIT/WEB/shortcuts';

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
