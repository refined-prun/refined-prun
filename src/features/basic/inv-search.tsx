import $style from './inv-search.module.css';
import css from '@src/utils/css-utils.module.css';

function onTileReady(tile: PrunTile) {
  // Only add search bar to the main INV tile
  if (tile.parameter) {
    return;
  }

  subscribe($$(tile.anchor, C.InventoriesListContainer.filter), async inventoryFilters => {
    const tableBody = await $(tile.anchor, 'tbody');

    const onInput = (e: Event) => {
      const input = e.target as HTMLInputElement;
      for (let i = 0; i < tableBody.children.length; i++) {
        const row = tableBody.children[i] as HTMLElement;
        if (filterRow(row, input.value)) {
          row.classList.remove(css.hidden);
        } else {
          row.classList.add(css.hidden);
        }
      }
    };

    createFragmentApp(() => (
      <div>
        <input class={$style.inputText} placeholder="Enter location" onInput={onInput} />
      </div>
    )).after(inventoryFilters);
  });
}

function filterRow(row: HTMLElement, search: string) {
  if (!search || search === '') {
    // Always return all rows for empty searches
    return true;
  }

  // The location of the inventory
  const location = row.children[1].textContent!.toLowerCase();
  if (location !== '--') {
    // Just match the search text into the location name
    if (location.includes(search.toLowerCase())) {
      return true;
    }
  }

  // The name of the ship ('' if a non-ship inventory)
  const name = row.children[2].textContent!.toLowerCase();
  if (name !== '') {
    // Just match the search text into the ship name
    if (name.includes(search.toLowerCase())) {
      return true;
    }
  }

  return false;
}

function init() {
  tiles.observe(['INV', 'SHPI'], onTileReady);
}

features.add(import.meta.url, init, 'INV/SHPI: Adds a search bar to the main INV buffer.');
