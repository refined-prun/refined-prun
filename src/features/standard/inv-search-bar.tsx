import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';

function onTileReady(tile: PrunTile) {
  // Only add search bar to the main INV tile
  if (tile.parameter) {
    return;
  }

  subscribe($$(tile.anchor, PrunCss.InventoriesListContainer.filter), inventoryFilters => {
    const searchBarDiv = document.createElement('div');
    inventoryFilters.after(searchBarDiv);

    // Create search bar
    const searchBar = document.createElement('input');
    searchBar.classList.add('input-text');
    searchBarDiv.appendChild(searchBar);
    searchBar.style.width = '200px';
    searchBar.placeholder = 'Enter location';

    // Get table of inventories
    const tableBody = tile.anchor.querySelector('tbody')!;

    // Add change listener to search bar to filter list
    searchBar.addEventListener('input', () => {
      for (let i = 0; i < tableBody.children.length; i++) {
        const row = tableBody.children[i] as HTMLElement;
        if (filterRow(row, searchBar.value)) {
          row.style.display = 'table-row';
        } else {
          row.style.display = 'none';
        }
      }
    });
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

features.add({
  id: 'inv-search-bar',
  description: 'INV: Adds a search bar to the main INV buffer.',
  init,
});
