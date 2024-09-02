import buffers from '@src/infrastructure/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import descendantPresent from '@src/utils/descendant-present';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { widgetAppend } from '@src/utils/vue-mount';
import BuildingCountSection from './BuildingCountSection.vue';

async function onBufferCreated(buffer: PrunBuffer) {
  const naturalId = buffer.parameter;
  if (!naturalId) {
    return;
  }

  const container = await descendantPresent(buffer.frame, PrunCss.Site.container);
  widgetAppend(container, BuildingCountSection, { naturalId });
}

export function init() {
  buffers.observe('BS', onBufferCreated);
}

void features.add({
  id: 'bs-building-list',
  init,
});
