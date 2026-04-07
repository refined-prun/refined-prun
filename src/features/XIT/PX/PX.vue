<script setup lang="ts">
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import { prunAtob } from '@src/infrastructure/prun-ui/base64';
import { isValidUrl } from '@src/utils/is-valid-url';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { useXitCommand } from '@src/hooks/use-xit-command';

const command = useXitCommand();
const parameters = useXitParameters();
const baseurl = 'https://prunderground.app/';
const url = baseurl + getPage();
function getPage() {
  const cmd = command.toUpperCase();

  if (cmd === 'PX' || cmd === 'PXB') {
    var suburl = 'listings/';
    if (parameters.length > 0) {
      suburl += '?material=' + parameters[0].toUpperCase();
    }
    console.log(parameters);
    return suburl;
  } else if (cmd === 'PXOS' || cmd === 'PXD') {
    return 'dashboard';
  } else if (cmd === 'PXA') {
    return 'auth/account';
  } else if (cmd === 'PXBB') {
    return 'bundles/';
  }
}

const loading = ref(true);
</script>

<template>
  <iframe
    :src="url"
    allow="clipboard-write"
    width="100%"
    height="99.65%"
    style="border-width: 0"
    @load="loading = false" />
</template>
