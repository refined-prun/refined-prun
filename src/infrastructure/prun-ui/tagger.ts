export enum ElementTag {
  FXPO_LOTS_FIELD = 'rp-fxpo-lots-field',
  FXPO_CURRENT_PRICE_FIELD = 'rp-fxpo-current-price-field',
  FXPO_MAXIMUM_PRICE_FIELD = 'rp-fxpo-maximum-price-field',
  FXPO_MINIMUM_PRICE_FIELD = 'rp-fxpo-minimum-price-field',
  INV_LOCATION_CELL = 'rp-inv-location-cell',
  INV_NAME_CELL = 'rp-inv-name-cell',
  POPID_RESERVE_CELL = 'rp-popid-reserve-cell',
}

export function tagUI() {
  tagTileFormFields('FXPO', [
    [L.ForExPlaceOrderForm.label.lots(), ElementTag.FXPO_LOTS_FIELD],
    [L.ForExPlaceOrderForm.label.price(), ElementTag.FXPO_CURRENT_PRICE_FIELD],
    [L.ForExPlaceOrderForm.limit.maximum(), ElementTag.FXPO_MAXIMUM_PRICE_FIELD],
    [L.ForExPlaceOrderForm.limit.minimum(), ElementTag.FXPO_MINIMUM_PRICE_FIELD],
  ]);

  tagTileTable('INV', [
    [L.InventoriesPanel.table.address(), ElementTag.INV_LOCATION_CELL],
    [L.InventoriesPanel.table.name(), ElementTag.INV_NAME_CELL],
  ]);

  tagTileTable('POPID', [[L.Contribution.table.reserve(), ElementTag.POPID_RESERVE_CELL]]);
}

function tagTileFormFields(command: string, mapItems: MapItems) {
  const tagMap = buildMap(mapItems);
  tiles.observe(command, tile => tagFormFields(tile.anchor, tagMap));
}

function tagFormFields(parent: Element, tagMap: Map<string, ElementTag>) {
  subscribe($$(parent, C.forms.formComponent), formComponent => {
    const label = _$(formComponent, 'label');
    if (!label) {
      return;
    }
    const textContent = _$(label, 'span')?.textContent;
    if (!textContent) {
      return;
    }
    const tag = tagMap.get(textContent);
    if (tag !== undefined) {
      formComponent.classList.add(tag);
    }
  });
}

function tagTileTable(command: string, mapItems: MapItems) {
  const tagMap = buildMap(mapItems);
  tiles.observe(command, tile => {
    subscribe($$(tile.anchor, 'table'), table => tagTable(table, tagMap));
  });
}

function tagTable(table: HTMLTableElement, tagMap: Map<string, ElementTag>) {
  subscribe($$(table, 'thead'), thead => {
    const headerRow = thead.children[0];
    if (headerRow === undefined) {
      return;
    }
    const cells = Array.from(headerRow.children);
    const tags = cells.map(x => tagMap.get(x.textContent ?? ''));
    if (tags.every(x => x === undefined)) {
      return;
    }
    subscribe($$(table, 'tbody'), tbody => {
      subscribe($$(tbody, 'tr'), tr => {
        for (let i = 0; i < tags.length; i++) {
          const tag = tags[i];
          if (tag !== undefined) {
            tr.children.item(i)?.classList.add(tag);
          }
        }
      });
    });
  });
}

type MapItems = [string | undefined, ElementTag][];

function buildMap(items: MapItems) {
  const map = new Map<string, ElementTag>();
  for (const [key, value] of items) {
    if (key !== undefined) {
      map.set(key, value);
    }
  }
  return map;
}
