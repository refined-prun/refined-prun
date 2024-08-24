import buffers from '@src/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import descendantPresent from '@src/utils/descendant-present';
import PrunCss from '@src/prun-ui/prun-css';
import { widgetAppend, widgetBefore } from '@src/utils/vue-mount';
import ContextControlsItem from '@src/components/ContextControlsItem.vue';
import { sitesStore } from '@src/prun-api/data/sites';
import { getPlanetNaturalIdFromAddress } from '@src/prun-api/data/addresses';

async function onBufferCreated(buffer: PrunBuffer) {
  if (!buffer.parameter) {
    return;
  }

  if (!buffer.firstActivation) {
    return;
  }

  const site = sitesStore.getByShortId(buffer.parameter);
  if (!site) {
    return;
  }

  const props = {
    cmd: `XIT BURN ${getPlanetNaturalIdFromAddress(site.address)}`,
  };
  const contextBar = await descendantPresent(buffer.frame, PrunCss.ContextControls.container);
  if (contextBar.children[0]) {
    widgetBefore(contextBar.children[0], ContextControlsItem, props);
  } else {
    widgetAppend(contextBar, ContextControlsItem, props);
  }
}

export function init() {
  buffers.observe('PROD', onBufferCreated);
}

void features.add({
  id: 'prod-burn-link',
  init,
});
