<script setup lang="ts">
import { downloadFile } from '@src/util';
import DebugButton from '@src/features/XIT/DEV/DevButton.vue';
import { userData } from '@src/store/user-data';
import Cookies from 'js-cookie';
import { mergedPrunStyles, prunStyleUpdated } from '@src/infrastructure/prun-ui/prun-css';
import { isRecordingPrunLog, prunLog } from '@src/infrastructure/prun-api/prun-api-listener';
import SectionHeader from '@src/components/SectionHeader.vue';

function logUserData() {
  console.log(userData);
}

const prunDebug = ref(Cookies.get('pu-debug') === 'true');

function switchPrunDebug() {
  Cookies.set('pu-debug', (!prunDebug.value).toString());
  prunDebug.value = !prunDebug.value;
}

function recordPrunLog() {
  isRecordingPrunLog.value = true;
}

function stopRecordingPrunLog() {
  isRecordingPrunLog.value = false;
  downloadFile(prunLog.value, 'prun-log.json', true);
  prunLog.value = [];
}

function downloadCssDefinition() {
  let definition = `export {};\n`;
  definition += `declare global {\n`;
  definition += `  interface PrunCssClasses {\n`;
  for (const key of Object.keys(C)) {
    definition += `    ${key}: {\n`;
    for (const childKey of Object.keys(C[key])) {
      definition += `      ${childKey}: string;\n`;
    }
    definition += `    };\n`;
  }
  definition += '  }\n';
  definition += '}\n';
  downloadFile(definition, 'prun-css.types.d.ts', false);
}

function downloadPrunStyles() {
  downloadFile(mergedPrunStyles, 'prun.css', false);
  if (import.meta.env.DEV) {
    window.open('https://github.com/refined-prun/prun-css/upload/main');
  }
}
</script>

<template>
  <div :style="{ paddingTop: '4px' }">
    <SectionHeader>Warning: Messing with these can lead to unexpected behavior</SectionHeader>
    <DebugButton v-if="!isRecordingPrunLog" @click="recordPrunLog">Record PrUn Log</DebugButton>
    <DebugButton v-else @click="stopRecordingPrunLog">Stop Recording</DebugButton>
    <DebugButton @click="switchPrunDebug">
      {{ prunDebug ? 'Disable' : 'Enable' }} pu-debug
    </DebugButton>
    <DebugButton @click="logUserData">Log User Data</DebugButton>
    <DebugButton @click="downloadCssDefinition">Export prun-css.types.d.ts</DebugButton>
    <DebugButton @click="downloadPrunStyles">
      Export prun.css <span v-if="prunStyleUpdated">(new!)</span>
    </DebugButton>
  </div>
</template>
