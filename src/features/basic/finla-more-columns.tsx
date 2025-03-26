import $style from './finla-more-columns.module.css';
import css from '@src/utils/css-utils.module.css';
import { refTextContent } from '@src/utils/reactive-dom';
import { fixed0 } from '@src/utils/format';
import { currentAssets } from '@src/core/balance/current-assets';

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
    createFragmentApp(() => (
      <th
        class={[
          C.LiquidAssetsPanel.number,
          hiddenIfZero(currentAssets.inventory.mmMaterialsTotal),
        ]}>
        MM Materials
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
    const mmMaterials = computed(() => {
      return currency.value
        ? (currentAssets.inventory.cxInventory.value?.mmMaterialsTotal.get(currency.value) ?? 0)
        : 0;
    });
    createFragmentApp(() => (
      <td
        class={[
          C.LiquidAssetsPanel.number,
          hiddenIfZero(currentAssets.inventory.mmMaterialsTotal),
        ]}>
        {fixed0(mmMaterials.value)}
      </td>
    )).appendTo(row);
  });
}

function hiddenIfZero(total: Ref<number | undefined>) {
  return (total.value ?? 0) === 0 ? css.hidden : undefined;
}

function init() {
  applyCssRule(`.${C.LiquidAssetsPanel.row}`, $style.row);
  tiles.observe('FINLA', onTileReady);
}

features.add(import.meta.url, init, 'FINLA: Adds columns for additional liquid asset types.');
