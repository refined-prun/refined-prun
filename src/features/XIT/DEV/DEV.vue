<script setup lang="ts">
import { downloadFile } from '@src/util';
import DebugButton from '@src/features/XIT/DEV/DevButton.vue';
import { userData } from '@src/store/user-data';

function logUserData() {
  console.log(userData);
}

function downloadCssDefinition() {
  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  let definition = `export interface CssClasses {\n`;
  for (const key of Object.keys(C)) {
    definition += `  ${key}: ${capitalize(key)};\n`;
  }
  definition += '}\n';
  for (const key of Object.keys(C)) {
    definition += `\ninterface ${capitalize(key)} {\n`;
    for (const childKey of Object.keys(C[key])) {
      definition += `  ${childKey}: string;\n`;
    }
    definition += `}\n`;
  }
  downloadFile(definition, 'prun-css-types.ts', false);
}
</script>

<template>
  <div :style="{ paddingTop: '4px' }">
    <DebugButton @click="logUserData">Log User Data</DebugButton>
    <DebugButton @click="downloadCssDefinition">Export prun-css-types.ts</DebugButton>
  </div>
</template>
