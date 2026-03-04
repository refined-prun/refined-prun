import {
  changeInputValue,
  changeSelectIndex,
  changeTextAreaValue,
  clickElement,
  focusElement,
} from '@src/util';
import { sleep } from '@src/utils/sleep';
import { $ } from '@src/utils/select-dom';
import { contractDraftsStore } from '@src/infrastructure/prun-api/data/contract-drafts';

export async function waitFor(
  condition: () => boolean,
  timeout = 5000,
  interval = 100,
): Promise<boolean> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (condition()) return true;
    await sleep(interval);
  }
  return false;
}

// AddressSelector suggestions are rendered in #autosuggest-portal outside the tile DOM.
// Only one portal can be open at a time, so we search it directly.
export async function selectLocation(container: Element, locationName: string): Promise<boolean> {
  const input = (await $(container, C.AddressSelector.input)) as HTMLInputElement | null;
  if (!input) return false;

  const portal = document.getElementById('autosuggest-portal');
  if (!portal) return false;

  focusElement(input);
  changeInputValue(input, locationName);

  const appeared = await waitFor(
    () => _$$(portal, C.AddressSelector.suggestionContent).length > 0,
    5000,
  );
  if (!appeared) return false;

  const suggestions = _$$(portal, C.AddressSelector.suggestionContent) as HTMLElement[];
  const match =
    suggestions.find(s =>
      s.textContent?.trim().toLowerCase().includes(locationName.toLowerCase()),
    ) ?? suggestions.at(0);

  if (!match) return false;

  await clickElement(match);
  return true;
}

export async function selectMaterial(container: Element, ticker: string) {
  const input = (await $(container, C.MaterialSelector.input)) as HTMLInputElement | null;
  if (!input) return false;

  const suggestionsContainer = (await $(
    container,
    C.MaterialSelector.suggestionsContainer,
  )) as HTMLElement | null;

  focusElement(input);
  changeInputValue(input, ticker);

  const suggestionsList = await $(container, C.MaterialSelector.suggestionsList);

  if (suggestionsContainer) suggestionsContainer.style.display = 'none';

  const match = _$$(suggestionsList, C.MaterialSelector.suggestionEntry).find(
    entry => _$(entry, C.ColoredIcon.label)?.textContent === ticker,
  );

  if (!match) {
    if (suggestionsContainer) suggestionsContainer.style.display = '';
    return false;
  }

  await clickElement(match as HTMLElement);
  if (suggestionsContainer) suggestionsContainer.style.display = '';
  await sleep(200);
  return true;
}

// --- Shared contract draft helpers ---

export interface ContDraftContext {
  draftTile: { anchor: Element };
  log: { info: (msg: string) => void; warning: (msg: string) => void };
  setStatus: (msg: string) => void;
  fail: (msg: string) => void;
}

/**
 * Finds "Create New" button in any CONTD tile, clicks it, and waits for the
 * new draft to appear in the store. Returns the new draft or undefined on failure.
 */
export async function createNewDraft(
  ctx: ContDraftContext,
): Promise<PrunApi.ContractDraft | undefined> {
  const { log, setStatus, fail } = ctx;

  setStatus('Looking for Create New button...');

  const isCreateNew = (btn: Element) => btn.textContent?.trim().toLowerCase() === 'create new';

  const findContdButton = () => {
    for (const tile of tiles.find('CONTD', true)) {
      const btn = _$$(tile.anchor, C.Button.btn).find(isCreateNew);
      if (btn) return { tile, btn };
    }
    return undefined;
  };

  const createBtnReady = await waitFor(() => !!findContdButton(), 10000);
  if (!createBtnReady) {
    fail('Could not find "Create New" button');
    return undefined;
  }

  const { btn: createBtn } = findContdButton()!;

  const beforeIds = new Set((contractDraftsStore.all.value ?? []).map(d => d.naturalId));
  await clickElement(createBtn);

  setStatus('Waiting for draft to be created...');
  const draftAppeared = await waitFor(
    () => (contractDraftsStore.all.value ?? []).some(d => !beforeIds.has(d.naturalId)),
    8000,
  );
  if (!draftAppeared) {
    fail('Timed out waiting for new contract draft');
    return undefined;
  }

  const newDraft = (contractDraftsStore.all.value ?? []).find(d => !beforeIds.has(d.naturalId))!;
  log.info(`New draft created: ${newDraft.naturalId}`);
  return newDraft;
}

/**
 * Sets the contract name (first input) and preamble (textarea) in the draft tile.
 */
export async function setDraftNameAndPreamble(
  ctx: ContDraftContext,
  name: string,
  preamble: string,
): Promise<void> {
  const { draftTile, log, setStatus } = ctx;

  setStatus('Setting contract name...');

  const nameInput = (await $(draftTile.anchor, 'input')) as HTMLInputElement | null;
  if (nameInput) {
    focusElement(nameInput);
    nameInput.select();
    changeInputValue(nameInput, name);
    log.info(`Name set: ${name}`);
  } else {
    log.warning('Could not find name input');
  }

  const preambleInput = _$(draftTile.anchor, 'textarea') as HTMLTextAreaElement | null;
  if (preambleInput) {
    focusElement(preambleInput);
    changeTextAreaValue(preambleInput, preamble);
    log.info('Preamble set');
  }
}

/**
 * Clicks the first "save" button (draft details / preamble save).
 */
export async function saveDraftDetails(ctx: ContDraftContext): Promise<void> {
  const { draftTile, log, setStatus } = ctx;

  setStatus('Saving draft details...');

  const saveBtn = _$$(draftTile.anchor, C.Button.btn).find(
    (btn: HTMLElement) => btn.textContent?.trim().toLowerCase() === 'save',
  ) as HTMLElement | undefined;
  if (saveBtn) {
    await clickElement(saveBtn);
    log.info('Draft details saved');
  } else {
    log.warning('Could not find save button for draft details');
  }
}

/**
 * Waits for and clicks the "Select Template" button, then returns the
 * template type <select> element.
 */
export async function openTemplate(ctx: ContDraftContext): Promise<HTMLSelectElement | undefined> {
  const { draftTile, setStatus, fail } = ctx;

  setStatus('Opening template selection...');

  const selectTemplateBtnReady = await waitFor(
    () =>
      _$$(draftTile.anchor, 'button').some(
        btn => btn.textContent?.trim().toLowerCase() === 'select template',
      ),
    5000,
  );
  if (!selectTemplateBtnReady) {
    fail('Could not find "Select Template" button');
    return undefined;
  }
  const selectTemplateBtn = _$$(draftTile.anchor, 'button').find(
    btn => btn.textContent?.trim().toLowerCase() === 'select template',
  )!;
  await clickElement(selectTemplateBtn);

  const templateTypeContainer = await $(draftTile.anchor, C.TemplateSelection.templateTypeSelect);
  const templateSelect = _$(templateTypeContainer, 'select') as HTMLSelectElement | null;
  if (!templateSelect) {
    fail('Could not find template type select');
    return undefined;
  }

  return templateSelect;
}

/**
 * Selects a template type (e.g. 'SHIP', 'BUYING', 'SELLING') in the template dropdown.
 */
export function selectTemplateType(
  ctx: ContDraftContext,
  templateSelect: HTMLSelectElement,
  templateValue: string,
): void {
  const idx = Array.from(templateSelect.options).findIndex(o => o.value === templateValue);
  if (idx >= 0) {
    changeSelectIndex(templateSelect, idx);
  }
  ctx.log.info(`Selected "${templateValue}" template`);
}

/**
 * Finds the currency <select> and sets it to the given currency code.
 */
export async function setCurrency(ctx: ContDraftContext, currency: string): Promise<void> {
  const { draftTile, log } = ctx;

  const currencySelectFound = await waitFor(() => {
    const selects = _$$(draftTile.anchor, 'select') as HTMLSelectElement[];
    return selects.some(s => Array.from(s.options).some(o => o.value === currency));
  }, 3000);

  if (currencySelectFound) {
    const selects = _$$(draftTile.anchor, 'select') as HTMLSelectElement[];
    const currencySelect = selects.find(s =>
      Array.from(s.options).some(o => o.value === currency),
    )!;
    const currencyIndex = Array.from(currencySelect.options).findIndex(o => o.value === currency);
    if (currencyIndex >= 0) {
      changeSelectIndex(currencySelect, currencyIndex);
    }
    log.info(`Currency set to ${currency}`);
  } else {
    log.warning(`Could not find currency select for ${currency}`);
  }
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
 * for rows after the first, sets amount and selects material for each.
 */
export async function addMaterials(
  ctx: ContDraftContext,
  materials: MaterialEntry[],
  options?: AddMaterialsOptions,
): Promise<void> {
  const { draftTile, log, setStatus } = ctx;

  setStatus('Adding materials to template...');

  for (let i = 0; i < materials.length; i++) {
    const mat = materials[i];

    if (i > 0) {
      const addBtn = _$$(draftTile.anchor, 'button').find(btn => {
        const t = btn.textContent?.trim().toLowerCase();
        return t === 'add shipment' || t === 'add commodity';
      });
      if (!addBtn) {
        log.warning(`Could not find add button for ${mat.ticker}`);
        continue;
      }
      await clickElement(addBtn);
      await waitFor(() => _$$(draftTile.anchor, C.TemplateSelection.group).length >= i + 1, 2000);
    }

    const groups = _$$(draftTile.anchor, C.TemplateSelection.group);
    const group = groups.at(-1);
    if (!group) {
      log.warning(`Could not find group for ${mat.ticker}`);
      continue;
    }

    const amountInput = group.querySelector(
      'input[inputmode="numeric"]',
    ) as HTMLInputElement | null;
    if (amountInput) {
      focusElement(amountInput);
      amountInput.select();
      changeInputValue(amountInput, String(mat.amount));
    }

    const matSelectorContainer = _$(group, C.MaterialSelector.container);
    if (matSelectorContainer) {
      const ok = await selectMaterial(matSelectorContainer, mat.ticker);
      if (ok) {
        log.info(`Added: ${mat.ticker} x${mat.amount}`);
      } else {
        log.warning(`Could not select material ${mat.ticker}`);
      }
    }

    options?.setPrice?.(group, mat.ticker);
  }
}

/**
 * Sets the deadline (days to fulfill) input.
 */
export function setDeadline(ctx: ContDraftContext, days: number): void {
  const { draftTile, log } = ctx;

  if (days <= 0) return;

  const deadlineInput = draftTile.anchor.querySelector(
    'input[name="deadline"]',
  ) as HTMLInputElement | null;
  if (deadlineInput) {
    focusElement(deadlineInput);
    deadlineInput.select();
    changeInputValue(deadlineInput, String(days));
    log.info(`Deadline set: ${days} days`);
  }
}

/**
 * Waits for "Apply Template" button, clicks it, and waits for the
 * disabled→enabled round-trip confirming the server processed it.
 */
export async function applyTemplate(ctx: ContDraftContext): Promise<boolean> {
  const { draftTile, log, setStatus, fail } = ctx;

  setStatus('Applying template...');

  const applyBtnReady = await waitFor(
    () =>
      _$$(draftTile.anchor, 'button').some(
        btn => btn.textContent?.trim().toLowerCase() === 'apply template',
      ),
    5000,
  );
  if (!applyBtnReady) {
    fail('Could not find "Apply Template" button');
    return false;
  }
  const applyBtn = _$$(draftTile.anchor, 'button').find(
    btn => btn.textContent?.trim().toLowerCase() === 'apply template',
  )!;

  await clickElement(applyBtn);
  await waitFor(() => applyBtn.classList.contains(C.Button.disabled), 3000);
  await waitFor(() => !applyBtn.classList.contains(C.Button.disabled), 5000);
  log.info('Template applied');
  return true;
}

/**
 * Pauses for user review, then clicks the last "save" button (conditions save).
 */
export async function saveConditions(
  ctx: ContDraftContext,
  waitAct: (status?: string) => Promise<void>,
): Promise<void> {
  const { draftTile, log, setStatus } = ctx;

  await waitAct('Save conditions?');
  setStatus('Saving conditions...');

  const condSaveBtn = _$$(draftTile.anchor, C.Button.btn).findLast(
    (btn: HTMLElement) => btn.textContent?.trim().toLowerCase() === 'save',
  ) as HTMLElement | undefined;
  if (condSaveBtn && !condSaveBtn.classList.contains(C.Button.disabled)) {
    await clickElement(condSaveBtn);
    log.info('Conditions saved');
  } else {
    log.warning('Conditions save button not found or disabled');
  }
}
