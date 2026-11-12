import $style from './inv-search.module.css';
import css from '@src/utils/css-utils.module.css';

function onTileReady(tile: PrunTile) {
  // Only the draft list, not a single draft.
  if (tile.parameter) {
    return;
  }

  let search = '';
  let added = false;

  subscribe($$(tile.anchor, 'table'), table => {
    // One search bar per buffer, above the draft table.
    if (added) {
      return;
    }
    added = true;

    const applyToRow = (row: HTMLElement) => {
      if (matchesRow(table, row, search)) {
        row.classList.remove(css.hidden);
      } else {
        row.classList.add(css.hidden);
      }
    };

    const onInput = (e: Event) => {
      search = (e.target as HTMLInputElement).value;
      for (const row of Array.from(table.querySelectorAll('tbody > tr'))) {
        applyToRow(row as HTMLElement);
      }
    };

    createFragmentApp(() => (
      <div>
        <input class={$style.inputText} placeholder="Filter by name" onInput={onInput} />
      </div>
    )).before(table);

    // Rows are re-rendered when drafts change, so new rows get the filter too.
    subscribe($$(table, 'tbody'), tbody => {
      subscribe($$(tbody, 'tr'), tr => applyToRow(tr));
    });
  });
}

function getNameColumn(table: HTMLElement) {
  const headers = Array.from(table.querySelectorAll('thead th'));
  return headers.findIndex(x => x.textContent?.trim().toLowerCase() === 'name');
}

function matchesRow(table: HTMLElement, row: HTMLElement, search: string) {
  const query = search.trim().toLowerCase();
  if (!query) {
    return true;
  }
  // Use the whole row if the Name column is not found.
  const column = getNameColumn(table);
  const cell = column >= 0 ? row.children[column] : row;
  const text = cell?.textContent?.toLowerCase() ?? '';
  return text.includes(query);
}

function init() {
  tiles.observe('CONTD', onTileReady);
}

features.add(import.meta.url, init, 'CONTD: Adds a search bar to filter contract drafts by name.');
