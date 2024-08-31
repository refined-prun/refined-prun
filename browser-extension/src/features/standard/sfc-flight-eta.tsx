import { convertDurationToETA, parseDuration } from '@src/util';
import features from '@src/feature-registry';
import buffers from '@src/infrastructure/prun-ui/prun-buffers';
import { $$ } from 'select-dom';
import { _$$ } from '@src/utils/get-element-by-class-name';
import { widgetAppend } from '@src/utils/vue-mount';

const tag = 'rp-sfc-eta';

function updateBuffer(buffer: PrunBuffer) {
  if (!buffer.frame.isConnected) {
    return;
  }
  const cleanupList = _$$(tag, buffer.frame);
  for (const element of cleanupList) {
    element.remove();
  }
  const elements = $$('table > tbody > tr', buffer.frame);
  let currentTime = 0;
  for (let i = 1; i < elements.length; i++) {
    const targetRow = elements[i] as HTMLElement;
    const etaData = targetRow.children[3];
    if (etaData.textContent != '') {
      const duration = parseDuration(etaData.textContent);
      const eta = convertDurationToETA(duration + currentTime);
      widgetAppend(etaData, () => <span class={tag}> ({eta})</span>);
      currentTime += duration;
    }
  }
  const firstRow = elements[0] as HTMLElement;
  if (firstRow) {
    const firstEtaData = firstRow.children[3];
    if (firstEtaData) {
      if (firstEtaData.textContent != '') {
        const totalEta = convertDurationToETA(currentTime);
        widgetAppend(firstEtaData, () => <span class={tag}> ({totalEta})</span>);
      }
    }
  }

  requestAnimationFrame(() => updateBuffer(buffer));
}

function init() {
  buffers.observe('SFC', updateBuffer);
}

void features.add({
  id: 'sfc-arrival-eta',
  init,
});