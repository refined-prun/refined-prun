import { refAttributeValue } from '@src/utils/reactive-dom';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { changeInputValue, clickElement } from '@src/util';

async function onTileReady(tile: PrunTile) {
  const field = await $(tile.anchor, C.StoreTransferPanel.amountInput);
  const input = await $(field, 'input');
  const button = await $(field, C.Button.btn);
  input.addEventListener('blur', () => clickElement(button));
  const slider = await $(tile.anchor, 'rc-slider-handle');
  const sliderValue = refAttributeValue(slider, 'aria-valuenow');
  watchEffectWhileNodeAlive(slider, () => changeInputValue(input, sliderValue.value!));
}

function init() {
  tiles.observe('MTRA', onTileReady);
}

features.add(import.meta.url, init, 'MTRA: Syncs the "Amount" slider with the input field.');
