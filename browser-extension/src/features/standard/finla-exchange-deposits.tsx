import classes from './finla-exchange-deposits.module.css';
import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import { observeReadyElementsByTagName } from '@src/utils/mutation-observer';
import { refTextContent } from '@src/utils/reactive-dom';
import { computed } from 'vue';
import { fixed0 } from '@src/utils/format';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { currentAssets } from '@src/core/balance/current-assets';
import { watchWhileNodeAlive } from '@src/utils/watch-while-node-alive';

async function onTileReady(tile: PrunTile) {
  observeReadyElementsByTagName('thead', {
    baseElement: tile.frame,
    callback: onTableHeadReady,
  });
  observeReadyElementsByTagName('tbody', {
    baseElement: tile.frame,
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
        currency.value ? currentAssets.cxDeposits.value?.get(currency.value) ?? 0 : 0,
      );
      watchWhileNodeAlive(row, cxDeposits, x => (cx.textContent = fixed0(x)), { immediate: true });
      const fx = row.appendChild(document.createElement('td'));
      fx.classList.add(PrunCss.LiquidAssetsPanel.number);
      const fxDeposits = computed(() =>
        currency.value ? currentAssets.fxDeposits.value?.get(currency.value) ?? 0 : 0,
      );
      watchWhileNodeAlive(row, fxDeposits, x => (fx.textContent = fixed0(x)), { immediate: true });
    },
  });
}

export function init() {
  for (let i = 2; i < 5; i++) {
    applyCssRule(`.${PrunCss.LiquidAssetsPanel.row} td:nth-child(${i})`, classes.row);
  }
  tiles.observe('FINLA', onTileReady);
}

void features.add({
  id: 'finla-exchange-deposits',
  init,
});
