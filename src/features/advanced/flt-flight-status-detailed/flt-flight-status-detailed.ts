import FleetStatusCell from './FleetStatusCell.vue';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import css from '@src/utils/css-utils.module.css';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), onRowReady);
}

function onRowReady(row: HTMLTableRowElement) {
  const id = refPrunId(row);
  if (!id.value) return;

  const statusCell = row.children.item(3);
  if (!(statusCell instanceof HTMLTableCellElement)) return;

  statusCell.style.display = 'table-cell';
  statusCell.classList.remove(C.Link.link);
  for (const child of Array.from(statusCell.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      child.textContent = '';
    }
  }

  createFragmentApp(FleetStatusCell, {
    shipId: id.value,
    rowElement: row,
  }).appendTo(statusCell);

  const nativeButtonCell = row.children.item(8);
  if (nativeButtonCell instanceof HTMLElement) {
    nativeButtonCell.style.width = '1px';
    nativeButtonCell.style.whiteSpace = 'nowrap';
    const nativeContainer = nativeButtonCell.querySelector(`.${C.Fleet.buttons}`);
    if (nativeContainer instanceof HTMLElement) {
      Object.assign(nativeContainer.style, {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        width: 'max-content',
        justifyContent: 'flex-start',
      });
    }
  }
}

function init() {
  const selectors = ['FLT', 'FLTS', 'FLTP'];
  tiles.observe(selectors, onTileReady);

  // Hide game-managed content inside the status cell, keeping our Vue wrapper visible
  applyCssRule(selectors, 'tr > :nth-child(4) > :not([data-rp])', css.hidden);

  // Hide unnecessary original columns to make room for our custom cell
  applyCssRule(selectors, 'tr > :nth-child(1)', css.hidden); // Transponder
  applyCssRule(selectors, 'tr > :nth-child(6)', css.hidden); // Source
  applyCssRule(selectors, 'tr > :nth-child(7)', css.hidden); // Destination
  applyCssRule(selectors, 'tr > :nth-child(8)', css.hidden); // ETA
}

features.add(import.meta.url, init, 'FLT: Declarative Compact Status cell.');
