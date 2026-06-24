export enum ElementTag {
  FXPO_LOTS_FIELD = 'rp-fxpo-lots-field',
  FXPO_CURRENT_PRICE_FIELD = 'rp-fxpo-current-price-field',
  FXPO_MAXIMUM_PRICE_FIELD = 'rp-fxpo-maximum-price-field',
  FXPO_MINIMUM_PRICE_FIELD = 'rp-fxpo-minimum-price-field',
}

export function tagUI() {
  tagFxpoFields();
}

function tagFxpoFields() {
  const map = buildMap([
    [L.ForExPlaceOrderForm.label.lots(), ElementTag.FXPO_LOTS_FIELD],
    [L.ForExPlaceOrderForm.label.price(), ElementTag.FXPO_CURRENT_PRICE_FIELD],
    [L.ForExPlaceOrderForm.limit.maximum(), ElementTag.FXPO_MAXIMUM_PRICE_FIELD],
    [L.ForExPlaceOrderForm.limit.minimum(), ElementTag.FXPO_MINIMUM_PRICE_FIELD],
  ]);

  tiles.observe('FXPO', tile => {
    subscribe($$(tile.anchor, C.forms.formComponent), formComponent => {
      const label = _$(formComponent, 'label');
      if (!label) {
        return;
      }
      const span = _$(label, 'span');
      if (!span) {
        return;
      }
      const textContent = span.textContent;
      if (textContent) {
        const tag = map.get(textContent);
        if (tag !== undefined) {
          formComponent.classList.add(tag);
        }
      }
    });
  });
}

function buildMap(items: [string | undefined, ElementTag][]) {
  const map = new Map<string, ElementTag>();
  for (const [key, value] of items) {
    if (key !== undefined) {
      map.set(key, value);
    }
  }
  return map;
}
