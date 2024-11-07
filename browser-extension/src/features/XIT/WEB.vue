<script lang="ts">
import xit from '@src/features/XIT/xit-registry';
import { castArray } from '@src/utils/cast-array';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { changeValue } from '@src/util';
import features from '@src/feature-registry';
import WEB from '@src/features/XIT/WEB.vue';
import { $, $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { isEmpty } from 'ts-extras';
import { prunBtoa } from '@src/infrastructure/prun-ui/base64';

xit.add({
  command: 'WEB',
  name: 'WEB PAGE',
  component: () => WEB,
});

const shortcuts = new Map<string, (parameters: string[]) => string | undefined>();

function shortcut(
  commands: string | string[],
  name: string,
  url: (parameters: string[]) => string | undefined,
) {
  xit.add({
    command: commands,
    name: name,
    component: () => WEB,
  });
  for (const command of castArray(commands)) {
    shortcuts.set(command.toUpperCase(), url);
  }
}

shortcut('PRUN', 'PRUN-CEPTION', () => 'https://apex.prosperousuniverse.com/');

shortcut('PROSPERITY', 'PROSPERITY', parameters => {
  let url = 'https://prosperity-prun.netlify.app/';
  if (parameters.length == 2) {
    url += `?from=${parameters[0]}&to=${parameters[1]}`;
  }
  return url;
});

shortcut(['SHEET', 'SHEETS'], 'GOOGLE SHEETS', parameters => {
  if (isEmpty(parameters)) {
    return undefined;
  }
  let url = parameters.join('_');
  return `https://docs.google.com/spreadsheets/d/${url}/edit?usp=sharing&rm=minimal`;
});

shortcut(['PLANNER', 'PLAN', 'PRUN PLANNER'], 'GOOGLE SHEETS', parameters => {
  return 'https://prunplanner.org/' + parameters.join('/');
});

shortcut('MAP', "Taiyi's Map", () => 'https://universemap.duckdns.org/');

async function onSelectorReady(selector: HTMLElement) {
  const input: HTMLInputElement = await $(selector, PrunCss.PanelSelector.input);
  const form = input.form!;
  form.addEventListener('submit', ev => {
    const parts = input.value.split(' ');
    const isXitWeb = parts[0].toUpperCase() === 'XIT' && parts[1].toUpperCase() === 'WEB';
    if (!isXitWeb || !isValidUrl(parts[2]) || parts[3]) {
      return;
    }

    ev.stopPropagation();
    parts[2] =
      prunBtoa(parts[2])
        .match(/.{1,200}/g)
        ?.join(' ') || '';
    changeValue(input, parts.join(' '));
    setTimeout(() => form.requestSubmit(), 0);
  });
}

function isValidUrl(url: string) {
  try {
    return Boolean(new URL(url));
  } catch {
    return false;
  }
}

function init() {
  subscribe($$(document, PrunCss.Tile.selector), onSelectorReady);
}

features.add({
  id: 'xit-web-correct-command',
  init,
});
</script>

<script setup lang="ts">
import { useXitParameters } from '@src/hooks/useXitParameters';
import { inject } from 'vue';
import { prunAtob } from '@src/infrastructure/prun-ui/base64';

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
