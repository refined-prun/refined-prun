import { createContextButton } from '@src/util';
import buffers from '@src/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import childElementPresent from '@src/utils/child-element-present';
import PrunCss from '@src/prun-ui/prun-css';
import prun from '@src/prun-api/prun';

async function onBufferCreated(buffer: PrunBuffer) {
  if (!buffer.firstActivation) {
    return;
  }

  const title = await childElementPresent(buffer.frame, PrunCss.TileFrame.title);
  if (!title.textContent) {
    return;
  }

  const name = parseBurnName(title.textContent);
  if (!name) {
    return;
  }

  const button = createContextButton('BURN', 'Enhanced Burn', `XIT BURN ${name}`);
  const contextBar = await childElementPresent(buffer.frame, PrunCss.ContextControls.container);
  if (contextBar.children[0]) {
    contextBar.insertBefore(button, contextBar.children[0]);
  } else {
    contextBar.appendChild(button);
  }
}

export function parseBurnName(text: string) {
  try {
    // Unnamed system unnamed planet
    let match = text.match(/([A-Z]{2}-[0-9]{3} [a-z]) Production/);
    if (match && match[1]) {
      return match[1].replace(' ', '');
    }
    // Named system named planet
    match = text.match(/([A-z ]*) - ([A-z ]*) Production/);
    if (match && match[1] && match[2]) {
      return match[2];
    }
    // Named system unnamed planet
    match = text.match(/([A-z ]*) ([A-z]) Production/);
    const system = prun.systems.getByName(match?.[1]);
    if (system) {
      return system.naturalId + match![2].toLowerCase();
    }
    // Unnamed system named planet
    match = text.match(/[A-Z]{2}-[0-9]{3} - ([A-z ]*) Production/);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch (TypeError) {
    return text;
  }
}

export function init() {
  buffers.observe('PROD', onBufferCreated);
}

void features.add({
  id: 'prod-burn-link',
  init,
});
