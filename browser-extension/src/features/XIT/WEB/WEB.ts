import xit from '@src/features/XIT/xit-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { changeValue } from '@src/util';
import features from '@src/feature-registry';
import WEB from '@src/features/XIT/WEB/WEB.vue';
import { $, $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { prunBtoa } from '@src/infrastructure/prun-ui/base64';
import { isValidUrl } from '@src/features/XIT/WEB/shared';

xit.add({
  command: 'WEB',
  name: 'WEB PAGE',
  component: () => WEB,
});

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

function init() {
  subscribe($$(document, PrunCss.Tile.selector), onSelectorReady);
}

features.add({
  id: 'xit-web-correct-command',
  description: 'Corrects the command for XIT WEB',
  init,
});
