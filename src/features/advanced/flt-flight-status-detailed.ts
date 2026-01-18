import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { displaytimeBetween, hhmm } from '@src/utils/format';
import { timestampEachMinute } from '@src/utils/dayjs';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import css from '@src/utils/css-utils.module.css';
import {
  getEntityNameFromAddress,
  getLocationLineFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { getInvStore } from '@src/core/store-id';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
const STATUS_ICONS: Record<string, string> = {
  TAKE_OFF: '↑',
  DEPARTURE: '↗',
  TRANSIT: '⟶',
  CHARGE: '±',
  JUMP: '➾',
  FLOAT: '↑',
  APPROACH: '↘',
  LANDING: '↓',
  LOCK: '⟴',
  DECAY: '⟴',
  JUMP_GATEWAY: '⟴',
};

function getLocationName(address: PrunApi.Address | undefined): string {
  if (address == undefined) return '';
  if (address.lines.length === 0) return '';
  const location = getLocationLineFromAddress(address);
  if (location?.type === 'STATION') {
    return location.entity.naturalId || location.entity.name;
  }
  return getEntityNameFromAddress(address) || address.lines[0]?.entity.naturalId || '';
}

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), onRowReady);
}

function onRowReady(row: HTMLTableRowElement) {
  const id = refPrunId(row);
  if (!id.value) return;

  const ship = computed(() => shipsStore.getById(id.value));
  const flight = computed(() => flightsStore.getById(ship.value?.flightId));

  const inventory = computed(() => {
    const ship = shipsStore.getById(id.value);
    return getInvStore(ship?.idShipStore);
  });

  const statusIcon = computed(() => {
    if (!ship.value) return '';
    if (!flight.value) return '⦁';
    const segment = flight.value.segments[flight.value.currentSegmentIndex];
    if (segment == null) {
      return '⦁';
    }
    return STATUS_ICONS[segment.type] || '?';
  });

  const posData = computed(() => {
    const address = flight.value?.destination ?? ship.value?.address ?? undefined;
    const location = getLocationLineFromAddress(address);
    const name = getLocationName(address);
    const prefix = location?.type === 'STATION' ? 'STNS' : 'PLI';
    const command = `${prefix} ${location?.entity.naturalId}`;
    const state = {
      address: address,
      name: name,
      location: getLocationLineFromAddress(address),
      command: command,
      invCommand: `INV ${location?.entity.naturalId}`,
    };
    console.log(state);
    return state;
  });

  const timeData = computed(() => {
    const arrival = flight.value?.arrival.timestamp;
    if (arrival === undefined || Number.isNaN(arrival)) return undefined;

    return {
      relative: displaytimeBetween(timestampEachMinute.value, arrival),
      absolute: hhmm(arrival),
    };
  });

  watchEffectWhileNodeAlive(row, () => {
    const statusCell = row.children[3] as HTMLTableCellElement;

    //const newIcon = statusIcon.value;
    //const newText = timeData.value ? `${posData.value.name}${timeData.value.relative}${timeData.value.absolute}` : '';

    statusCell.innerHTML = '';

    while (statusCell.firstChild && statusCell.lastChild) {
      statusCell.removeChild(statusCell.lastChild);
    }
    statusCell.style.display = 'table-cell';
    statusCell.classList.remove(C.Link.link);

    let container = statusCell.querySelector('.custom-status-container') as HTMLElement;
    if (container == null) {
      statusCell.replaceChildren();
      container = document.createElement('div');
      container.className = 'custom-status-container';
      container.style.display = 'flex';
      container.style.justifyContent = 'space-between';
      container.style.alignItems = 'flex-start';
      container.style.width = '100%';
      statusCell.appendChild(container);
    }

    container.replaceChildren();

    // --- SUB-FLEXBOX 1: Icon and Location ---
    const leftSubFlex = document.createElement('div');
    leftSubFlex.style.display = 'flex';
    leftSubFlex.style.flexDirection = 'column';
    leftSubFlex.style.alignItems = 'flex-start';
    const iconContainer = document.createElement('div');
    iconContainer.style.display = 'flex';
    iconContainer.style.gap = '4px';
    const invSpan = document.createElement('span');
    invSpan.textContent = `☒`;
    invSpan.style.color = '#3fa2de';
    invSpan.classList.add(C.Link.link);
    invSpan.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      showBuffer(posData.value.invCommand);
    };
    invSpan.title = posData.value.invCommand;
    iconContainer.appendChild(invSpan);
    const iconSpan = document.createElement('span');
    iconSpan.textContent = statusIcon.value;
    iconSpan.style.color = '#3fa2de';
    iconSpan.style.cursor = 'pointer';
    iconSpan.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      showBuffer(`SFC ${ship.value!.registration}`);
    };
    iconSpan.title = `SFC ${ship.value!.registration}`;
    iconContainer.appendChild(iconSpan);
    leftSubFlex.appendChild(iconContainer);

    const destDiv = document.createElement('div');
    const destSpan = document.createElement('span');
    destSpan.textContent = posData.value.name;
    destSpan.style.color = '#3fa2de';
    destSpan.classList.add(C.Link.link);
    destSpan.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      showBuffer(posData.value.command);
    };
    destSpan.title = posData.value.command;
    destDiv.appendChild(destSpan);

    leftSubFlex.appendChild(destDiv);
    container.appendChild(leftSubFlex);
    const rightSubFlex = document.createElement('div');
    rightSubFlex.style.display = 'flex';
    rightSubFlex.style.flexDirection = 'column';
    rightSubFlex.style.alignItems = 'flex-end';
    rightSubFlex.style.textAlign = 'right';
    if (timeData.value) {
      rightSubFlex.style.cursor = 'pointer';
      rightSubFlex.onclick = e => {
        e.preventDefault();
        e.stopPropagation();
        showBuffer(`SFC ${ship.value!.registration}`);
      };
      rightSubFlex.title = `SFC ${ship.value!.registration}`;

      const relativeSpan = document.createElement('span');
      relativeSpan.textContent = timeData.value.relative;
      relativeSpan.style.color = '#99d5ff';
      rightSubFlex.appendChild(relativeSpan);

      const absoluteSpan = document.createElement('span');
      absoluteSpan.style.color = '#888';
      absoluteSpan.textContent = `(${timeData.value.absolute})`;
      rightSubFlex.appendChild(absoluteSpan);
    } else {
      const unloadBtn = document.createElement('span');
      const flightBtn = document.createElement('span');

      unloadBtn.style.margin = '4px';
      unloadBtn.style.fontSize = '15px';
      //unloadBtn.style.paddingLeft = '2px';
      //unloadBtn.style.paddingRight = '2px';
      //unloadBtn.style.paddingBottom = '1px';
      unloadBtn.style.height = '20px';
      unloadBtn.style.width = unloadBtn.style.height;
      unloadBtn.style.cursor = 'pointer';
      unloadBtn.style.padding = '1.5px 5.5px 1px 1px';
      //unloadBtn.style.border = '1px solid #999'
      flightBtn.style.margin = unloadBtn.style.margin;
      flightBtn.style.fontSize = '16px';
      flightBtn.style.paddingLeft = unloadBtn.style.paddingLeft;
      flightBtn.style.paddingRight = unloadBtn.style.paddingRight;
      flightBtn.style.cursor = unloadBtn.style.cursor;
      flightBtn.style.cursor = unloadBtn.style.cursor;
      flightBtn.textContent = '✈';
      flightBtn.title = `SFC ${ship.value!.registration}`;
      flightBtn.style.color = '#ffffff';
      flightBtn.style.backgroundColor = '#5cb85c';
      flightBtn.style.padding = '2px 2px 1px 1px';

      flightBtn.style.height = unloadBtn.style.height;
      flightBtn.style.width = unloadBtn.style.height;
      flightBtn.onclick = () => {
        showBuffer(`SFC ${ship.value!.registration}`);
      };

      const unload = (inventory.value?.items.length ?? 0) > 0;

      if (unload) {
        unloadBtn.style.color = '#ffff';
        unloadBtn.style.backgroundColor = '#f7a600';
        unloadBtn.textContent = '⭱';
        unloadBtn.title = 'Unload';
      } else {
        unloadBtn.style.color = '#ffff';
        unloadBtn.style.backgroundColor = '#43a4df';
        unloadBtn.textContent = '⭳';
        unloadBtn.title = `SHPI ${ship.value!.registration}`;
      }

      unloadBtn.onclick = e => {
        const actionCell = row.children[8] as HTMLElement;
        if (actionCell != null) {
          // Find all button-like elements or specifically 'button' tags
          const buttons = actionCell.querySelectorAll('button, .button, [role="button"]');

          // Target the 4th button (index 3)
          const targetButton = buttons[3] as HTMLElement;

          if (targetButton != null && unload) {
            targetButton.click();
          } else {
            // Fallback if the button isn't found
            showBuffer(`SHPI ${ship.value!.registration}`);
          }
        } else {
          showBuffer(`NULL ${ship.value!.registration}`);
        }
      };
      rightSubFlex.appendChild(unloadBtn);
      rightSubFlex.appendChild(flightBtn);
      rightSubFlex.style.flexDirection = 'row';
    }
    container.appendChild(rightSubFlex);

    const nativeButtonCell = row.children[8] as HTMLElement;
    if (nativeButtonCell != null) {
      // Direct table cell manipulation
      nativeButtonCell.style.width = '1px';
      nativeButtonCell.style.whiteSpace = 'nowrap';

      const nativeContainer = nativeButtonCell.querySelector(`.${C.Fleet.buttons}`) as HTMLElement;
      if (nativeContainer != null) {
        // Direct Javascript style injection to override the game's layout
        nativeContainer.style.display = 'flex';
        nativeContainer.style.flexDirection = 'row';
        nativeContainer.style.flexWrap = 'nowrap';
        nativeContainer.style.flexShrink = '0';
        nativeContainer.style.width = 'max-content';
        nativeContainer.style.minWidth = 'max-content';
        nativeContainer.style.justifyContent = 'flex-start';
      }
    }
  });

  //const observer = new MutationObserver(() => updateStatusCell());
  //observer.observe(row, { childList: true, subtree: true, characterData: true });
  //updateStatusCell();
}

function init() {
  const selectors = ['FLT', 'FLTS', 'FLTP'];
  tiles.observe(selectors, onTileReady);

  applyCssRule(selectors, 'tr > :nth-child(1)', css.hidden); // Transponder
  //applyCssRule(selectors, 'tr > :nth-child(5)', css.hidden);
  applyCssRule(selectors, 'tr > :nth-child(6)', css.hidden); // Source
  applyCssRule(selectors, 'tr > :nth-child(7)', css.hidden); // Destination
  applyCssRule(selectors, 'tr > :nth-child(8)', css.hidden); // ETA
  //applyCssRule(selectors, 'tr > :nth-child(9)', css.hidden); // Buttons
  //applyCssRule(selectors, C.Fleet.buttons, 'flex-wrap: nowrap !important;');
}

features.add(import.meta.url, init, 'FLT: Compact Status icons with infinite-loop protection.');
