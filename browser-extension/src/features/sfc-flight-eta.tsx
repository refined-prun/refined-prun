import { convertDurationToETA, parseDuration } from '../util';
import features from '@src/feature-registry';
import buffers from '@src/prun-ui/prun-buffers';
import { h } from 'dom-chef';
import { $$ } from 'select-dom';

const tag = 'rpu-sfc-eta';

function updateBuffer(buffer: PrUnBuffer) {
  if (!buffer.frame.isConnected) {
    return;
  }
  const cleanupList = $$(`.${tag}`, buffer.frame);
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
      etaData.appendChild(<span className={tag}> ({eta})</span>);
      currentTime += duration;
    }
  }
  const firstRow = elements[0] as HTMLElement;
  if (firstRow) {
    const firstEtaData = firstRow.children[3];
    if (firstEtaData) {
      if (firstEtaData.textContent != '') {
        const totalEta = convertDurationToETA(currentTime);
        firstEtaData.appendChild(<span className={tag}> ({totalEta})</span>);
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
