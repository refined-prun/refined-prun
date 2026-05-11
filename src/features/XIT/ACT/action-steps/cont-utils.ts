import {
  changeInputValue,
  changeSelectIndex,
  changeTextAreaValue,
  clickElement,
  focusElement,
} from '@src/util';
import { sleep } from '@src/utils/sleep';
import { contractDraftsStore } from '@src/infrastructure/prun-api/data/contract-drafts';
import { AssertFn } from '@src/features/XIT/ACT/shared-types';
import { Logger } from '@src/features/XIT/ACT/runner/logger';

type SetStatus = (status: string) => void;

// AddressSelector suggestions render in #autosuggest-portal outside the tile DOM.
// Only one portal can be open at a time, so we search it directly.
export async function selectLocation(container: Element, locationName: string) {
  const input = (await $(container, C.AddressSelector.input)) as HTMLInputElement;
  const portal = document.getElementById('autosuggest-portal');
  if (!portal) {
    return false;
  }

  focusElement(input);
  changeInputValue(input, locationName);

  const appeared = await pollUntil(
    () => _$$(portal, C.AddressSelector.suggestionContent).length > 0,
    5000,
  );
  if (!appeared) {
    return false;
  }

  const suggestions = _$$(portal, C.AddressSelector.suggestionContent) as HTMLElement[];
  const lower = locationName.toLowerCase();
  const match = suggestions.find(x => x.textContent?.trim().toLowerCase().includes(lower));
  if (!match) {
    return false;
  }
  await clickElement(match);
  return true;
}

export async function selectMaterial(container: Element, ticker: string) {
  const input = (await $(container, C.MaterialSelector.input)) as HTMLInputElement;
  const suggestionsContainer = (await $(
    container,
    C.MaterialSelector.suggestionsContainer,
  )) as HTMLElement;

  focusElement(input);
  changeInputValue(input, ticker);

  const suggestionsList = await $(container, C.MaterialSelector.suggestionsList);

  // Hide the dropdown to keep the tile clean while we click programmatically.
  suggestionsContainer.style.display = 'none';
  try {
    const match = _$$(suggestionsList, C.MaterialSelector.suggestionEntry).find(
      x => _$(x, C.ColoredIcon.label)?.textContent === ticker,
    ) as HTMLElement | undefined;
    if (!match) {
      return false;
    }
    await clickElement(match);
    await sleep(200);
    return true;
  } finally {
    suggestionsContainer.style.display = '';
  }
}

// --- Contract draft helpers. ---
// Each helper takes the tile anchor it operates on plus an `assert` for hard
// failures. Callers own status/log messages they want to surface.

const isText = (text: string) => (x: Element) => x.textContent?.trim().toLowerCase() === text;

function findButton(anchor: Element, text: string) {
  return _$$(anchor, C.Button.btn).find(isText(text)) as HTMLButtonElement | undefined;
}

async function pollUntil(condition: () => boolean, timeout: number, interval = 100) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (condition()) {
      return true;
    }
    await sleep(interval);
  }
  return false;
}

/**
 * Clicks "Create New" in any open CONTD tile and waits for the new draft to
 * appear in the store. Returns the new draft.
 */
export async function createNewDraft(assert: AssertFn, log: Logger, setStatus: SetStatus) {
  setStatus('Looking for Create New button...');

  const findCreateBtn = () => {
    for (const tile of tiles.find('CONTD', true)) {
      const btn = findButton(tile.anchor, 'create new');
      if (btn) {
        return btn;
      }
    }
    return undefined;
  };

  const ready = await pollUntil(() => findCreateBtn() !== undefined, 10000);
  assert(ready, 'Could not find "Create New" button');

  const beforeIds = new Set((contractDraftsStore.all.value ?? []).map(x => x.naturalId));
  await clickElement(findCreateBtn()!);

  setStatus('Waiting for draft to be created...');
  const appeared = await pollUntil(
    () => (contractDraftsStore.all.value ?? []).some(x => !beforeIds.has(x.naturalId)),
    8000,
  );
  assert(appeared, 'Timed out waiting for new contract draft');

  const newDraft = (contractDraftsStore.all.value ?? []).find(x => !beforeIds.has(x.naturalId))!;
  log.info(`New draft created: ${newDraft.naturalId}`);
  return newDraft;
}

/**
 * Sets the contract name (first input) and preamble (textarea).
 */
export async function setDraftNameAndPreamble(
  anchor: Element,
  log: Logger,
  setStatus: SetStatus,
  name: string,
  preamble: string,
) {
  setStatus('Setting contract name...');

  const nameInput = (await $(anchor, 'input')) as HTMLInputElement;
  focusElement(nameInput);
  nameInput.select();
  changeInputValue(nameInput, name);
  log.info(`Name set: ${name}`);

  const preambleInput = _$(anchor, 'textarea') as HTMLTextAreaElement | undefined;
  if (preambleInput) {
    focusElement(preambleInput);
    changeTextAreaValue(preambleInput, preamble);
    log.info('Preamble set');
  }
}

/**
 * Clicks the first "save" button (draft details / preamble save).
 */
export async function saveDraftDetails(anchor: Element, log: Logger, setStatus: SetStatus) {
  setStatus('Saving draft details...');

  const saveBtn = findButton(anchor, 'save');
  if (saveBtn) {
    await clickElement(saveBtn);
    log.info('Draft details saved');
  } else {
    log.warning('Could not find save button for draft details');
  }
}

/**
 * Clicks "Select Template" and returns the template type <select>.
 */
export async function openTemplate(assert: AssertFn, anchor: Element, setStatus: SetStatus) {
  setStatus('Opening template selection...');

  const ready = await pollUntil(() => findButton(anchor, 'select template') !== undefined, 5000);
  assert(ready, 'Could not find "Select Template" button');

  await clickElement(findButton(anchor, 'select template')!);

  const container = await $(anchor, C.TemplateSelection.templateTypeSelect);
  const select = _$(container, 'select') as HTMLSelectElement | undefined;
  assert(select, 'Could not find template type select');
  return select;
}

// Maps stored action values to the game's select option values.
const templateValueMap: Record<string, string> = {
  BUYING: 'BUY',
  SELLING: 'SELL',
};

export function selectTemplateType(log: Logger, select: HTMLSelectElement, value: string) {
  const mapped = templateValueMap[value] ?? value;
  const idx = Array.from(select.options).findIndex(x => x.value === mapped);
  if (idx >= 0) {
    changeSelectIndex(select, idx);
    log.info(`Selected "${value}" template`);
  } else {
    log.warning(`Template "${value}" not found in select`);
  }
}

export async function setCurrency(anchor: Element, log: Logger, currency: string) {
  const findCurrencySelect = () =>
    (_$$(anchor, 'select') as HTMLSelectElement[]).find(x =>
      Array.from(x.options).some(opt => opt.value === currency),
    );

  const ready = await pollUntil(() => findCurrencySelect() !== undefined, 3000);
  if (!ready) {
    log.warning(`Could not find currency select for ${currency}`);
    return;
  }

  const select = findCurrencySelect()!;
  const idx = Array.from(select.options).findIndex(x => x.value === currency);
  changeSelectIndex(select, idx);
  log.info(`Currency set to ${currency}`);
}

export interface MaterialEntry {
  ticker: string;
  amount: number;
}

export interface AddMaterialsOptions {
  /** Called after each material row is set up, with the group element and ticker. */
  setPrice?: (group: Element, ticker: string) => void;
}

/**
 * Adds material rows to the contract template. Clicks "Add shipment"/"Add commodity"
 * for rows after the first, sets amount, selects material.
 */
export async function addMaterials(
  anchor: Element,
  log: Logger,
  setStatus: SetStatus,
  materials: MaterialEntry[],
  options?: AddMaterialsOptions,
) {
  setStatus('Adding materials to template...');

  const findAddButton = () =>
    _$$(anchor, 'button').find(x => {
      const t = x.textContent?.trim().toLowerCase();
      return t === 'add shipment' || t === 'add commodity';
    }) as HTMLButtonElement | undefined;

  for (let i = 0; i < materials.length; i++) {
    const mat = materials[i];

    if (i > 0) {
      const addBtn = findAddButton();
      if (!addBtn) {
        log.warning(`Could not find add button for ${mat.ticker}`);
        continue;
      }
      await clickElement(addBtn);
      await pollUntil(() => _$$(anchor, C.TemplateSelection.group).length >= i + 1, 2000);
    }

    const group = _$$(anchor, C.TemplateSelection.group).at(-1);
    if (!group) {
      log.warning(`Could not find group for ${mat.ticker}`);
      continue;
    }

    const amountInput = group.querySelector<HTMLInputElement>('input[inputmode="numeric"]');
    if (amountInput) {
      focusElement(amountInput);
      amountInput.select();
      changeInputValue(amountInput, String(mat.amount));
    }

    const matSelector = _$(group, C.MaterialSelector.container);
    if (matSelector) {
      const ok = await selectMaterial(matSelector, mat.ticker);
      if (ok) {
        log.info(`Added: ${mat.ticker} x${mat.amount}`);
      } else {
        log.warning(`Could not select material ${mat.ticker}`);
      }
    }

    options?.setPrice?.(group, mat.ticker);
  }
}

export function setDeadline(anchor: Element, log: Logger, days: number) {
  if (days <= 0) {
    return;
  }

  const input = anchor.querySelector<HTMLInputElement>('input[name="deadline"]');
  if (!input) {
    return;
  }
  focusElement(input);
  input.select();
  changeInputValue(input, String(days));
  log.info(`Deadline set: ${days} days`);
}

/**
 * Clicks "Apply Template" and waits for the disabled→enabled round-trip
 * confirming the client finished applying the template.
 */
export async function applyTemplate(
  assert: AssertFn,
  anchor: Element,
  log: Logger,
  setStatus: SetStatus,
) {
  setStatus('Applying template...');

  const ready = await pollUntil(() => findButton(anchor, 'apply template') !== undefined, 5000);
  assert(ready, 'Could not find "Apply Template" button');

  const applyBtn = findButton(anchor, 'apply template')!;
  await clickElement(applyBtn);
  await pollUntil(() => applyBtn.classList.contains(C.Button.disabled), 3000);
  await pollUntil(() => !applyBtn.classList.contains(C.Button.disabled), 5000);
  log.info('Template applied');
}

/**
 * Clicks the last "save" button (conditions save).
 */
export async function saveConditions(anchor: Element, log: Logger, setStatus: SetStatus) {
  setStatus('Saving conditions...');

  const condSaveBtn = (_$$(anchor, C.Button.btn) as HTMLButtonElement[]).findLast(isText('save'));
  if (condSaveBtn && !condSaveBtn.classList.contains(C.Button.disabled)) {
    await clickElement(condSaveBtn);
    log.info('Conditions saved');
  } else {
    log.warning('Conditions save button not found or disabled');
  }
}
