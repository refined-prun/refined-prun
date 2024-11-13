import classes from './finla-more-columns.module.css';
import css from '@src/utils/css-utils.module.css';
import { refTextContent } from '@src/utils/reactive-dom';
import { fixed0 } from '@src/utils/format';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { currentAssets } from '@src/core/balance/current-assets';
import { createFragmentApp } from '@src/utils/vue-fragment-app';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'thead'), onTableHeadReady);
  subscribe($$(tile.anchor, 'tbody'), onTableBodyReady);
}

function onTableHeadReady(thead: HTMLTableSectionElement) {
  subscribe($$(thead, 'tr'), row => {
    createFragmentApp(() => (
      <th class={[C.LiquidAssetsPanel.number, hiddenIfZero(currentAssets.cxDepositsTotal)]}>
        CX Deposits
      </th>
    )).appendTo(row);
    createFragmentApp(() => (
      <th class={[C.LiquidAssetsPanel.number, hiddenIfZero(currentAssets.fxDepositsTotal)]}>
        FX Deposits
      </th>
    )).appendTo(row);
  });
}

function onTableBodyReady(tbody: HTMLTableSectionElement) {
  subscribe($$(tbody, 'tr'), row => {
    const currencyCell = row.children[0];
    if (!currencyCell) {
      return;
    }
    const currency = refTextContent(currencyCell);
    createFragmentApp(() => (
      <td class={[C.LiquidAssetsPanel.number, hiddenIfZero(currentAssets.cxDepositsTotal)]}>
        {fixed0(currency.value ? (currentAssets.cxDeposits.value?.get(currency.value) ?? 0) : 0)}
      </td>
    )).appendTo(row);
    createFragmentApp(() => (
      <td class={[C.LiquidAssetsPanel.number, hiddenIfZero(currentAssets.fxDepositsTotal)]}>
        {fixed0(currency.value ? (currentAssets.fxDeposits.value?.get(currency.value) ?? 0) : 0)}
      </td>
    )).appendTo(row);
  });
}

function hiddenIfZero(total: Ref<number | undefined>) {
  return (total.value ?? 0) === 0 ? css.hidden : undefined;
}

function init() {
  applyCssRule(`.${C.LiquidAssetsPanel.row} td:first-child`, classes.firstColumn);
  applyCssRule(`.${C.LiquidAssetsPanel.row} td:not(:first-child)`, classes.otherColumns);
  tiles.observe('FINLA', onTileReady);
}

features.add(import.meta.url, init, 'FINLA: Adds a "CX Deposits" and "FX Deposits" columns.');
