import { refTextContent } from '@src/utils/reactive-dom';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { observeDescendantListChanged } from '@src/utils/mutation-observer';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.LiquidAssetsPanel.row), row => {
    const currency = refTextContent(row.children[0]);
    watchEffectWhileNodeAlive(row, () => {
      row.style.display = currency.value === 'ECD' ? 'none' : '';
    });
  });
  // Move the ECD column to the end to avoid breaking
  // the alternating table row colors.
  subscribe($$(tile.anchor, 'tbody'), tbody => {
    observeDescendantListChanged(tbody, () => {
      const rows = _$$(tbody, 'tr');
      for (const row of rows) {
        const currency = row.children[0].textContent;
        if (currency !== 'ECD') {
          continue;
        }
        if (row !== tbody.lastChild) {
          tbody.appendChild(row);
        }
        return;
      }
    });
  });
}

function init() {
  tiles.observe('FINLA', onTileReady);
}

features.add(import.meta.url, init, 'FINLA: Hides the ECD row.');
