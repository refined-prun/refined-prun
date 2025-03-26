import classes from './inv-compress-inventory-info.module.css';

async function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.StoreView.column), column => {
    const capacities = _$$(column, C.StoreView.capacity);
    if (capacities.length < 3) {
      return;
    }
    const container = document.createElement('div');
    container.classList.add(classes.capacityContainer);
    container.appendChild(capacities[1]);
    container.appendChild(capacities[2]);
    capacities[0].after(container);
  });
}

function init() {
  applyCssRule('INV', `.${C.StoreView.column}`, classes.storeViewColumn);
  applyCssRule('INV', `.${C.StoreView.container}`, classes.storeViewContainer);
  applyCssRule('INV', `.${C.InventorySortControls.controls}`, classes.sortControls);
  tiles.observe('INV', onTileReady);
}

features.add(import.meta.url, init, 'INV: Compresses specific inventory info into a row.');
