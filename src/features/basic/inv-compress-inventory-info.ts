import $style from './inv-compress-inventory-info.module.css';

async function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.StoreView.column), column => {
    const capacities = _$$(column, C.StoreView.capacity);
    if (capacities.length < 3) {
      return;
    }
    const container = document.createElement('div');
    container.classList.add($style.capacityContainer);
    container.appendChild(capacities[1]);
    container.appendChild(capacities[2]);
    capacities[0].after(container);
  });
}

function init() {
  applyCssRule(['INV', 'SHPI'], `.${C.StoreView.column}`, $style.storeViewColumn);
  applyCssRule(['INV', 'SHPI'], `.${C.StoreView.container}`, $style.storeViewContainer);
  applyCssRule(['INV', 'SHPI'], `.${C.InventorySortControls.controls}`, $style.sortControls);
  tiles.observe(['INV', 'SHPI'], onTileReady);
}

features.add(import.meta.url, init, 'INV/SHPI: Compresses specific inventory info into a row.');
