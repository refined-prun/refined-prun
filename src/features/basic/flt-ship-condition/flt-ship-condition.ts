import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import ShipCondition from './ShipCondition.vue';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'table'), async table => {
    // Find the column by its header, because the game changes the column order.
    const headerRow = await $(await $(table, 'thead'), 'tr');
    const nameHeader = L.FleetPanel.table.ship();
    const nameIndex = Array.from(headerRow.children).findIndex(x => x.textContent === nameHeader);
    if (nameIndex === -1) {
      return;
    }
    subscribe($$(await $(table, 'tbody'), 'tr'), row => {
      const cell = row.children.item(nameIndex);
      if (!cell) {
        return;
      }
      createFragmentApp(
        ShipCondition,
        reactive({
          id: refPrunId(row),
        }),
      ).appendTo(cell);
    });
  });
}

function init() {
  tiles.observe(['FLT', 'FLTS', 'FLTP'], onTileReady);
}

features.add(import.meta.url, init, 'FLT: Adds a ship condition label to the "Name" column.');
