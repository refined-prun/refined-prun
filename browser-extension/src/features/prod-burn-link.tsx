import { createContextButton } from '@src/util';
import buffers from '@src/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import descendantPresent from '@src/utils/descendant-present';
import PrunCss from '@src/prun-ui/prun-css';
import { getStarNaturalId, starsStore } from '@src/prun-api/data/stars';

async function onBufferCreated(buffer: PrunBuffer) {
  if (!buffer.firstActivation) {
    return;
  }

  const title = await descendantPresent(buffer.frame, PrunCss.TileFrame.title);
  if (!title.textContent) {
    return;
  }

  const name = parseBurnName(title.textContent);
  if (!name) {
    return;
  }

  const button = createContextButton('BURN', 'Enhanced Burn', `XIT BURN ${name}`);
  const contextBar = await descendantPresent(buffer.frame, PrunCss.ContextControls.container);
  if (contextBar.children[0]) {
    contextBar.children[0].before(button);
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
    const system = starsStore.getByName(match?.[1]);
    if (system) {
      return getStarNaturalId(system) + match![2].toLowerCase();
    }
    // Unnamed system named planet
    match = text.match(/[A-Z]{2}-[0-9]{3} - ([A-z ]*) Production/);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch {
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
