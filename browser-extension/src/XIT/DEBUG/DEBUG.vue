<script lang="ts">
import xit from '@src/XIT/xit-registry.js';
import features from '@src/feature-registry.js';
import DEBUG from '@src/XIT/DEBUG/DEBUG.vue';

function init() {
  xit.add({
    command: 'DEBUG',
    name: 'DEBUG',
    vueComponent: DEBUG,
  });
}

features.add({
  id: 'xit-debug',
  init,
});

export default {};
</script>

<script setup lang="ts">
import { $$ } from 'select-dom';
import { downloadFile } from '@src/util';
import DebugButton from '@src/XIT/DEBUG/DebugButton.vue';

function downloadCss() {
  const classes: string[] = [];
  const styles = $$('style', document.head);
  for (const style of styles) {
    const text = style.textContent;
    if (!text) {
      continue;
    }
    const matches = text.match(/[\w-]+__[\w-]+___[\w-]+/g);
    for (const match of matches ?? []) {
      classes.push(match);
    }
  }
  classes.sort();
  const result = {};
  for (const cssClass of classes) {
    const camelize = (s: string) => s.replace(/-./g, x => x[1].toUpperCase());
    const parts = cssClass.replace('.', '').replace('___', '_').replace('__', '_').split('_');
    const parent = camelize(parts[0]);
    if (parent === '') {
      continue;
    }
    const child = camelize(parts[1]);
    let parentObject = result[parent];
    if (parentObject === undefined) {
      parentObject = {};
      result[parent] = parentObject;
    }
    if (parentObject[child] !== undefined) {
      continue;
    }
    parentObject[child] = cssClass.replace('.', '');
  }
  const json = JSON.stringify(result, undefined, 2);
  downloadFile(json, 'prun-css-classes.json', false);
}
</script>

<template>
  <div :style="{ height: '100%', flexGrow: 1, paddingTop: '4px' }">
    <DebugButton @click="downloadCss">Export CSS classes</DebugButton>
  </div>
</template>
