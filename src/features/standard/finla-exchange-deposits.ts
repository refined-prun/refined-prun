import classes from './finla-exchange-deposits.module.css';
import css from '@src/utils/css-utils.module.css';
import { refTextContent } from '@src/utils/reactive-dom';
import { fixed0 } from '@src/utils/format';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { currentAssets } from '@src/core/balance/current-assets';
import { watchEffectWhileNodeAlive } from '@src/utils/watch-effect-while-node-alive';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'thead'), onTableHeadReady);
  subscribe($$(tile.anchor, 'tbody'), onTableBodyReady);
}

function onTableHeadReady(thead: HTMLTableSectionElement) {
  subscribe($$(thead, 'tr'), row => {
    const cx = row.appendChild(document.createElement('th'));
    cx.textContent = 'CX Deposits';
    cx.classList.add(C.LiquidAssetsPanel.number);
    hideCellIfZeroTotal(cx, currentAssets.cxDepositsTotal);
    const fx = row.appendChild(document.createElement('th'));
    fx.textContent = 'FX Deposits';
    fx.classList.add(C.LiquidAssetsPanel.number);
    hideCellIfZeroTotal(fx, currentAssets.fxDepositsTotal);
  });
}

function onTableBodyReady(tbody: HTMLTableSectionElement) {
  subscribe($$(tbody, 'tr'), row => {
    const currencyCell = row.children[0];
    if (!currencyCell) {
      return;
    }
    const currency = refTextContent(currencyCell);
    const cx = row.appendChild(document.createElement('td'));
    cx.classList.add(C.LiquidAssetsPanel.number);
    const cxDeposits = computed(() =>
      currency.value ? (currentAssets.cxDeposits.value?.get(currency.value) ?? 0) : 0,
    );
    watchEffectWhileNodeAlive(row, () => (cx.textContent = fixed0(cxDeposits.value)));
    hideCellIfZeroTotal(cx, currentAssets.cxDepositsTotal);
    const fx = row.appendChild(document.createElement('td'));
    fx.classList.add(C.LiquidAssetsPanel.number);
    const fxDeposits = computed(() =>
      currency.value ? (currentAssets.fxDeposits.value?.get(currency.value) ?? 0) : 0,
    );
    watchEffectWhileNodeAlive(row, () => (fx.textContent = fixed0(fxDeposits.value)));
    hideCellIfZeroTotal(fx, currentAssets.fxDepositsTotal);
  });
}

function hideCellIfZeroTotal(cell: HTMLTableCellElement, total: Ref<number | undefined>) {
  watchEffectWhileNodeAlive(cell.parentElement!, () => {
    if ((total.value ?? 0) === 0) {
      cell.classList.add(css.hidden);
    } else {
      cell.classList.remove(css.hidden);
    }
  });
}

function init() {
  applyCssRule(`.${C.LiquidAssetsPanel.row} td:first-child`, classes.firstColumn);
  applyCssRule(`.${C.LiquidAssetsPanel.row} td:not(:first-child)`, classes.otherColumns);
  tiles.observe('FINLA', onTileReady);
}

features.add(import.meta.url, init, 'FINLA: Adds a "CX Deposits" and "FX Deposits" columns.');
