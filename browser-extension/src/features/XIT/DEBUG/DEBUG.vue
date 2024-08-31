<script lang="ts">
import xit from '@src/features/XIT/xit-registry.js';
import DEBUG from '@src/features/XIT/DEBUG/DEBUG.vue';

xit.add({
  command: 'DEBUG',
  name: 'DEBUG',
  component: () => DEBUG,
});

export default {};
</script>

<script setup lang="ts">
import { downloadFile } from '@src/util';
import DebugButton from '@src/features/XIT/DEBUG/DebugButton.vue';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';

function downloadCssDefinition() {
  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  let definition = `export interface CssClasses {\n`;
  for (const key of Object.keys(PrunCss)) {
    definition += `  ${key}: ${capitalize(key)};\n`;
  }
  definition += '}\n';
  for (const key of Object.keys(PrunCss)) {
    definition += `\ninterface ${capitalize(key)} {\n`;
    for (const childKey of Object.keys(PrunCss[key])) {
      definition += `  ${childKey}: string;\n`;
    }
    definition += `}\n`;
  }
  downloadFile(definition, 'prun-css-types.ts', false);
}
</script>

<template>
  <div :style="{ paddingTop: '4px' }">
    <DebugButton @click="downloadCssDefinition">Export prun-css-types.ts</DebugButton>
  </div>
</template>
