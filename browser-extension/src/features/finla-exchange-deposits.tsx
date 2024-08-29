import './finla-exchange-deposits.css';
import buffers from '../prun-ui/prun-buffers';
import features from '../feature-registry';
import { observeReadyElementsByTagName } from '@src/utils/mutation-observer';
import { refTextContent } from '@src/utils/reactive-dom';
import onElementDisconnected from '@src/utils/on-element-disconnected';
import { computed, watch } from 'vue';
import { deposits } from '@src/core/deposits';
import { fixed0 } from '@src/utils/format';
import PrunCss from '@src/prun-ui/prun-css';
import { applyCssRule } from '@src/prun-ui/refined-prun-css';

async function onBufferCreated(buffer: PrunBuffer) {
  observeReadyElementsByTagName('thead', {
    baseElement: buffer.frame,
    callback: onTableHeadReady,
  });
  observeReadyElementsByTagName('tbody', {
    baseElement: buffer.frame,
    callback: onTableBodyReady,
  });
}

function onTableHeadReady(thead: HTMLTableSectionElement) {
  observeReadyElementsByTagName('tr', {
    baseElement: thead,
    callback: row => {
      const cx = row.appendChild(document.createElement('th'));
      cx.textContent = 'CX Deposits';
      cx.classList.add(PrunCss.LiquidAssetsPanel.number);
      const fx = row.appendChild(document.createElement('th'));
      fx.textContent = 'FX Deposits';
      fx.classList.add(PrunCss.LiquidAssetsPanel.number);
    },
  });
}

function onTableBodyReady(tbody: HTMLTableSectionElement) {
  observeReadyElementsByTagName('tr', {
    baseElement: tbody,
    callback: row => {
      const currencyCell = row.children[0];
      if (!currencyCell) {
        return;
      }
      const currency = refTextContent(currencyCell);
      const cx = row.appendChild(document.createElement('td'));
      cx.classList.add(PrunCss.LiquidAssetsPanel.number);
      const cxDeposits = computed(() =>
        currency.value ? deposits.value.get(currency.value)?.cx ?? 0 : 0,
      );
      onElementDisconnected(
        row,
        watch(cxDeposits, x => (cx.textContent = fixed0(x)), { immediate: true }),
      );
      const fx = row.appendChild(document.createElement('td'));
      fx.classList.add(PrunCss.LiquidAssetsPanel.number);
      const fxDeposits = computed(() =>
        currency.value ? deposits.value.get(currency.value)?.fx ?? 0 : 0,
      );
      onElementDisconnected(
        row,
        watch(fxDeposits, x => (fx.textContent = fixed0(x)), { immediate: true }),
      );
    },
  });
}

export function init() {
  for (let i = 2; i < 5; i++) {
    applyCssRule(`.${PrunCss.LiquidAssetsPanel.row} td:nth-child(${i})`, 'row');
  }
  buffers.observe('FINLA', onBufferCreated);
}

void features.add({
  id: 'finla-exchange-deposits',
  init,
});
