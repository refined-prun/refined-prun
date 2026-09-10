import { clickElement } from '@src/util';
import { waitUntil } from '@src/utils/wait';
import $style from './contd-bulk-add-commodity.module.css';

function isAddButton(button: HTMLElement) {
  return (
    button.textContent === L.TemplateSelection.action.addCommodity() ||
    button.textContent === L.TemplateSelection.action.addShipment()
  );
}

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.Button.btn), button => {
    if (!isAddButton(button)) {
      return;
    }

    const countInput = document.createElement('input');
    countInput.type = 'number';
    countInput.min = '1';
    countInput.value = '1';
    countInput.className = $style.countInput;
    button.before(countInput);

    let running = false;
    button.addEventListener('click', async () => {
      if (running) {
        return;
      }
      running = true;
      try {
        const parsed = parseInt(countInput.value, 10);
        const n = Math.max(1, isNaN(parsed) ? 1 : parsed);
        const initialCount = _$$(tile.anchor, C.TemplateSelection.group).length;
        for (let i = 1; i < n; i++) {
          await waitForGroups(tile.anchor, initialCount + i);
          await clickElement(_$$(tile.anchor, 'button').find(isAddButton));
        }
      } finally {
        running = false;
      }
    });
  });
}

async function waitForGroups(anchor: Element, expected: number, timeout = 2000) {
  await waitUntil(() => _$$(anchor, C.TemplateSelection.group).length >= expected, timeout, 50);
}

function init() {
  tiles.observe('CONTD', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'CONTD: Adds a count input to add multiple commodity/shipment rows at once.',
);
