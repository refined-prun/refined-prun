import classes from './cxob-highlight-own-orders.module.css';
import buffers from '@src/infrastructure/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import { companyStore } from '@src/infrastructure/prun-api/data/company';

function onBufferCreated(buffer: PrunBuffer) {
  const rows = buffer.frame.getElementsByTagName('tr');
  const observer = new MutationObserver(() => {
    for (const row of Array.from(rows)) {
      if (row.firstChild?.textContent === companyStore.name) {
        row.classList.add(classes.highlight);
      } else {
        row.classList.remove(classes.highlight);
      }
    }
  });
  observer.observe(buffer.frame, { childList: true, subtree: true, characterData: true });
}

export function init() {
  buffers.observe('CXOB', onBufferCreated);
}

void features.add({
  id: 'cxob-highlight-own-orders',
  init,
});
