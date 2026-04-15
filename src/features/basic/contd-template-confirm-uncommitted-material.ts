import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { showConfirmationOverlay } from '@src/infrastructure/prun-ui/tile-overlay';

const committedValues = new WeakMap<HTMLInputElement, string>();

function recordCommitted(input: HTMLInputElement) {
  // Wait a tick so PrUn updates the input value with the resolved name first.
  setTimeout(() => committedValues.set(input, input.value), 0);
}

function isLikelyCommitted(input: HTMLInputElement) {
  const current = input.value;
  if (current.length === 0) {
    return true;
  }
  if (committedValues.get(input) === current) {
    return true;
  }
  // Pre-loaded forms: input value matches a known material name exactly.
  return materialsStore.getByName(current) !== undefined;
}

async function attachMaterialSelector(container: Element) {
  const input = (await $(container, 'input')) as HTMLInputElement;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      recordCommitted(input);
    }
  });
  // Suggestion clicks land here before the input value is finalized.
  const suggestionsList = await $(container, C.MaterialSelector.suggestionsList);
  suggestionsList.addEventListener('mousedown', () => recordCommitted(input));
}

const bypassConfirm = new WeakSet<HTMLElement>();

function checkAndMaybeBlock(template: Element, button: HTMLElement, event: Event) {
  if (bypassConfirm.has(button)) {
    bypassConfirm.delete(button);
    return;
  }
  const inputs = _$$(template, C.MaterialSelector.input) as HTMLInputElement[];
  const bad: { index: number; value: string }[] = [];
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    if (!isLikelyCommitted(input)) {
      bad.push({ index: i + 1, value: input.value });
    }
  }
  if (bad.length === 0) {
    return;
  }
  event.stopImmediatePropagation();
  event.preventDefault();
  const list = bad.map(x => `commodity #${x.index} ("${x.value}")`).join(', ');
  const verb = bad.length === 1 ? 'was' : 'were';
  const message =
    `${list} ${verb} typed but not selected from the dropdown. ` +
    `Applying this template will likely create a contract for RATIONS instead.`;
  showConfirmationOverlay(
    event,
    () => {
      bypassConfirm.add(button);
      button.click();
    },
    { message, confirmLabel: 'Apply anyway' },
  );
}

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.TemplateSelection.container), template => {
    subscribe($$(template, C.MaterialSelector.container), attachMaterialSelector);
    subscribe($$(template, C.Button.primary), button => {
      if (button.textContent?.trim().toLowerCase() !== 'apply template') {
        return;
      }
      const buttonEl = button as HTMLElement;
      buttonEl.addEventListener(
        'click',
        event => checkAndMaybeBlock(template, buttonEl, event),
        true,
      );
    });
  });
}

function init() {
  tiles.observe('CONTD', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'CONTD: Confirm before applying a template when a commodity was typed but not selected from the dropdown.',
);
