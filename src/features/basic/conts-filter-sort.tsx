import $style from './inv-search.module.css';
import css from '@src/utils/css-utils.module.css';
import PrunButton from '@src/components/PrunButton.vue';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { observeDescendantListChanged } from '@src/utils/mutation-observer';
import { oneMicrotask } from '@src/utils/one-microtask';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

type ContractKind = 'BUY' | 'SELL' | 'SHIP' | 'LOAN' | 'OTHER';
const kindFilters: (ContractKind | 'ALL')[] = ['ALL', 'BUY', 'SELL', 'SHIP', 'LOAN', 'OTHER'];

type SortKey = 'type' | 'location';

// Contract type from your point of view, read from the contract conditions.
function getContractKind(contract: PrunApi.Contract | undefined): ContractKind | undefined {
  if (!contract) {
    return undefined;
  }
  const types = contract.conditions.map(x => x.type);
  if (types.some(x => x.endsWith('_SHIPMENT'))) {
    return 'SHIP';
  }
  if (types.some(x => x.startsWith('LOAN_'))) {
    return 'LOAN';
  }
  // The party that provides the goods is the seller.
  const goods = contract.conditions.find(
    x => x.type === 'PROVISION' || x.type === 'COMEX_PURCHASE_PICKUP' || x.type === 'DELIVERY',
  );
  if (!goods) {
    return 'OTHER';
  }
  return goods.party === contract.party ? 'SELL' : 'BUY';
}

// Delivery place: the shipment destination, else the place where the goods change hands.
// A shipment pickup (origin) is never the delivery place.
function getContractLocationAddress(contract: PrunApi.Contract | undefined) {
  if (!contract) {
    return undefined;
  }
  for (const condition of contract.conditions) {
    if (condition.destination) {
      return condition.destination;
    }
  }
  for (const condition of contract.conditions) {
    if (condition.address) {
      return condition.address;
    }
  }
  return undefined;
}

function getContractLocation(contract: PrunApi.Contract | undefined) {
  return getEntityNameFromAddress(getContractLocationAddress(contract));
}

// Name and natural ID of the shown delivery place only, so "Hortus", "HRT" or "PD-754d" match.
function getContractLocationSearchText(contract: PrunApi.Contract | undefined) {
  const address = getContractLocationAddress(contract);
  if (!address) {
    return '';
  }
  const name = getEntityNameFromAddress(address) ?? '';
  const naturalId = getEntityNaturalIdFromAddress(address) ?? '';
  return `${name} ${naturalId}`.toLowerCase();
}

function getRowContract(row: HTMLElement) {
  const localId = row.children[0]?.textContent?.trim();
  return contractsStore.getByLocalId(localId);
}

function getRowValue(row: HTMLElement, key: SortKey) {
  const contract = getRowContract(row);
  const value = key === 'type' ? getContractKind(contract) : getContractLocation(contract);
  return value ?? '';
}

// Keeps the added cells at the end of the row, in order, when the game renders it again.
function keepCellsLast(row: HTMLElement, cells: HTMLElement[]) {
  const place = () => {
    const tail = Array.from(row.children).slice(-cells.length);
    if (tail.every((x, i) => x === cells[i])) {
      return;
    }
    for (const cell of cells) {
      row.appendChild(cell);
    }
  };
  place();
  observeDescendantListChanged(row, place);
}

function onTileReady(tile: PrunTile) {
  let search = '';
  const kindFilter = ref<ContractKind | 'ALL'>('ALL');
  const sortBy = ref<SortKey | undefined>();
  const sortDesc = ref(false);
  let added = false;
  let table: HTMLElement | undefined;
  let tbodyElement: HTMLElement | undefined;
  const headerCells: Partial<Record<SortKey, HTMLElement>> = {};

  const applyToRow = (row: HTMLElement) => {
    if (matchesRow(row, search) && matchesKind(row, kindFilter.value)) {
      row.classList.remove(css.hidden);
    } else {
      row.classList.add(css.hidden);
    }
  };

  const applyToAll = () => {
    for (const row of Array.from(table?.querySelectorAll('tbody > tr') ?? [])) {
      applyToRow(row as HTMLElement);
    }
  };

  const updateHeaders = () => {
    const labels: Record<SortKey, string> = { type: 'Type', location: 'Location' };
    for (const key of Object.keys(labels) as SortKey[]) {
      const th = headerCells[key];
      if (!th) {
        continue;
      }
      const arrow = sortBy.value !== key ? '' : sortDesc.value ? ' ▼' : ' ▲';
      th.textContent = labels[key] + arrow;
    }
  };

  // Moves the game rows in the sorted order, like the CXM exchange reorder.
  // Without a sort, rows move only when the sort is turned off: new game rows keep their place.
  const sortRows = (restoreGameOrder = false) => {
    const key = sortBy.value;
    if (!tbodyElement || (!key && !restoreGameOrder)) {
      return;
    }
    const tbody = tbodyElement;
    const rows = Array.from(tbody.children).filter(x => x.tagName === 'TR') as HTMLElement[];
    const dir = sortDesc.value ? -1 : 1;
    // The game lists the newest contracts first.
    const createdAt = (row: HTMLElement) => getRowContract(row)?.date.timestamp ?? 0;
    const byGame = (a: HTMLElement, b: HTMLElement) => createdAt(b) - createdAt(a);
    // Equal values keep the game order. Without a sort, the game order comes back.
    const compare = (a: HTMLElement, b: HTMLElement) => {
      if (key) {
        const result = getRowValue(a, key).localeCompare(getRowValue(b, key)) * dir;
        if (result !== 0) {
          return result;
        }
      }
      return byGame(a, b);
    };
    const sorted = rows.slice().sort(compare);
    if (sorted.every((row, i) => row === rows[i])) {
      return;
    }
    for (const row of sorted) {
      tbody.appendChild(row);
    }
  };
  const scheduleSort = oneMicrotask(() => sortRows());

  // Click cycle: ascending -> descending -> game order.
  const onSortClick = (key: SortKey) => {
    if (sortBy.value !== key) {
      sortBy.value = key;
      sortDesc.value = false;
    } else if (!sortDesc.value) {
      sortDesc.value = true;
    } else {
      sortBy.value = undefined;
      sortDesc.value = false;
    }
    updateHeaders();
    sortRows(true);
  };

  const addCells = (row: HTMLElement) => {
    const typeCell = document.createElement('td');
    const locationCell = document.createElement('td');
    const update = () => {
      const contract = getRowContract(row);
      typeCell.textContent = getContractKind(contract) ?? '';
      locationCell.textContent = getContractLocation(contract) ?? '';
    };
    keepCellsLast(row, [typeCell, locationCell]);
    // Stops when the game removes the row.
    watchEffectWhileNodeAlive(row, update);
  };

  subscribe($$(tile.anchor, 'table'), tableElement => {
    // One search bar per buffer, above the contract table.
    if (added) {
      return;
    }
    added = true;
    table = tableElement;
    const onInput = (e: Event) => {
      search = (e.target as HTMLInputElement).value;
      applyToAll();
    };
    const setKind = (kind: ContractKind | 'ALL') => {
      kindFilter.value = kind;
      applyToAll();
    };

    createFragmentApp(() => (
      <div>
        <input class={$style.inputText} placeholder="Filter by partner or base" onInput={onInput} />
        {kindFilters.map(kind => (
          <PrunButton
            key={kind}
            inline
            dark={kindFilter.value !== kind}
            primary={kindFilter.value === kind}
            onClick={() => setKind(kind)}>
            {kind}
          </PrunButton>
        ))}
      </div>
    )).before(tableElement);

    subscribe($$(tableElement, 'thead'), thead => {
      subscribe($$(thead, 'tr'), headerRow => {
        const cells: HTMLElement[] = [];
        for (const key of ['type', 'location'] as SortKey[]) {
          const th = document.createElement('th');
          th.style.cursor = 'pointer';
          th.style.userSelect = 'none';
          th.addEventListener('click', () => onSortClick(key));
          headerCells[key] = th;
          cells.push(th);
        }
        updateHeaders();
        keepCellsLast(headerRow, cells);
      });
    });

    // Rows are re-rendered when contracts change, so new rows get the cells and filters too.
    subscribe($$(tableElement, 'tbody'), tbody => {
      tbodyElement = tbody;
      subscribe($$(tbody, 'tr'), row => {
        addCells(row);
        applyToRow(row);
        scheduleSort();
      });
    });
  });
}

function matchesRow(row: HTMLElement, search: string) {
  if (!search) {
    return true;
  }
  const query = search.toLowerCase();
  // Column 0 is the contract ID, column 1 is the partner. The base name or ID also matches.
  const contract = row.children[0]?.textContent?.toLowerCase() ?? '';
  const partner = row.children[1]?.textContent?.toLowerCase() ?? '';
  const location = getContractLocationSearchText(getRowContract(row));
  return partner.includes(query) || contract.includes(query) || location.includes(query);
}

function matchesKind(row: HTMLElement, kind: ContractKind | 'ALL') {
  return kind === 'ALL' || getContractKind(getRowContract(row)) === kind;
}

function init() {
  tiles.observe('CONTS', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'CONTS: Adds sortable type and location columns, and filters by partner, location and type.',
);
