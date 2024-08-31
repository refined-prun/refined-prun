import buffers from '@src/infrastructure/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { convertDurationToETA, parseDuration } from '@src/util';

const tag = 'rp-order-eta';

function onBufferCreated(buffer: PrunBuffer) {
  if (!buffer.parameter) {
    return;
  }

  updateOrders(buffer);
  setInterval(() => updateOrders(buffer), 1000);
}

function updateOrders(buffer: PrunBuffer) {
  if (!buffer.frame.isConnected) {
    return;
  }
  const columns = buffer.frame.getElementsByClassName(PrunCss.SiteProductionLines.column);
  const elements = Array.from(columns);
  for (const queue of elements) {
    const prodSlots = Array.from(queue.children);
    let inQueue = false;
    let lineTimes = [] as number[];
    let timeElapsed = 0;
    for (const prodItem of prodSlots) {
      if (!prodItem.classList.contains(PrunCss.OrderSlot.container)) {
        inQueue = true;
        continue;
      }
      try {
        prodItem.getElementsByClassName(tag).item(0)?.remove();
        let duration: number;
        if (inQueue) {
          if (prodItem.children[0].children.length < 2) {
            continue;
          }
          lineTimes.sort((a, b) => a - b);
          const minTime = lineTimes[0];
          timeElapsed += minTime;
          lineTimes.shift();
          lineTimes = lineTimes.map(value => value - minTime);
          duration = parseDuration(prodItem.children[0].children[1].textContent);
          lineTimes.push(duration);
          if (!isNaN(duration + timeElapsed)) {
            const span = document.createElement('span');
            span.classList.add(tag);
            span.textContent = ` (${convertDurationToETA(duration + timeElapsed)})`;
            prodItem.children[0].children[1].appendChild(span);
          }
        } else {
          duration = parseDuration(prodItem.children[1].children[1].textContent);
          lineTimes.push(duration);
          if (!isNaN(duration)) {
            const span = document.createElement('span');
            span.classList.add(tag);
            span.textContent = ` (${convertDurationToETA(duration)})`;
            prodItem.children[1].children[1].appendChild(span);
          }
        }
      } catch {
        /* empty */
      }
    }
  }
}

export function init() {
  buffers.observe('PROD', onBufferCreated);
}

void features.add({
  id: 'prod-order-eta',
  init,
});
