import './cxob-highlight-own-orders.css';
import user from '@src/store/user';
import buffers from '@src/prun-ui/prun-buffers';
import features from '@src/feature-registry';

const className = 'rprun-cxob-own-order-highlight';

function onBufferCreated(buffer: PrunBuffer) {
  const rows = buffer.frame.getElementsByTagName('tr');
  const observer = new MutationObserver(() => {
    for (const row of Array.from(rows)) {
      if (row.firstChild?.textContent === user.company.name) {
        row.classList.add(className);
      } else {
        row.classList.remove(className);
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
