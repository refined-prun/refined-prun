<script lang="ts">
import xit from '@src/features/XIT/xit-registry';
import { castArray } from '@src/utils/cast-array';
import { _$ } from '@src/utils/get-element-by-class-name';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { changeValue } from '@src/util';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import features from '@src/feature-registry';
import WEB from '@src/features/XIT/WEB.vue';

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

shortcut('PRUN', 'PRUN-CEPTION', () => 'https://apex.prosperousuniverse.com/#/');

shortcut('PROSPERITY', 'PROSPERITY', parameters => {
  let url = 'https://prosperity-prun.netlify.app/';
  if (parameters.length == 3) {
    url += `?from=${parameters[1]}&to=${parameters[2]}`;
  }
  return url;
});

shortcut(['SHEET', 'SHEETS'], 'GOOGLE SHEETS', parameters => {
  if (parameters.length < 2) {
    return undefined;
  }
  let url = parameters[1];
  for (let i = 2; i < parameters.length; i++) {
    url += `_${parameters[i]}`;
  }
  return `https://docs.google.com/spreadsheets/d/${url}/edit?usp=sharing&rm=minimal`;
});

shortcut(['PLANNER', 'PLAN', 'PRUN PLANNER'], 'GOOGLE SHEETS', parameters => {
  let url = 'https://prunplanner.org';
  for (let i = 1; i < parameters.length; i++) {
    url += `/${parameters[i]}`;
  }
  return url;
});

shortcut('MAP', "Taiyi's Map", () => 'https://universemap.duckdns.org/');

function onSelectorReady(selector: HTMLDivElement) {
  const input = _$(PrunCss.PanelSelector.input, selector) as HTMLInputElement;
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

function prunBtoa(input: string) {
  const base64 = btoa(input);
  return base64.replaceAll('+', '-').replaceAll('/', '.').replaceAll('=', '');
}

function prunAtob(input: string) {
  let base64 = input.replaceAll('-', '+').replaceAll('.', '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

function init() {
  observeReadyElementsByClassName(PrunCss.Tile.selector, onSelectorReady);
}

features.add({
  id: 'xit-web-correct-command',
  init,
});
</script>

<script setup lang="ts">
import { useXitParameters } from '@src/hooks/useXitParameters';
import { inject } from 'vue';

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
