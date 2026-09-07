import { fixed0 } from '@src/utils/format';
import {
  changeInputValue,
  changeSelectIndex,
  changeTextAreaValue,
  clickElement,
  focusElement,
  selectMaterialInMaterialSelector,
  selectAndChangeInputValue,
} from '@src/util';
import { sleep } from '@src/utils/sleep';
import { contractDraftsStore } from '@src/infrastructure/prun-api/data/contract-drafts';
import { ActionStepExecuteContext, AssertFn } from '@src/features/XIT/ACT/shared-types';

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

  const lower = locationName.toLowerCase();
  const match = await pollUntil(
    () =>
      _$$(portal, C.AddressSelector.suggestionContent).find(x =>
        x.textContent?.trim().toLowerCase().includes(lower),
      ),
    5000,
  );
  if (!match) {
    return false;
  }
  await clickElement(match);
  return true;
}

const isText = (text: string | undefined) => (x: Element) =>
  text !== undefined && x.textContent?.trim().toLowerCase() === text.trim().toLowerCase();

function findButton(anchor: Element, text: string | undefined) {
  return _$$(anchor, C.Button.btn).find(isText(text)) as HTMLButtonElement | undefined;
}

async function pollUntil<T>(
  condition: () => T,
  timeout: number,
  interval = 100,
): Promise<T | undefined> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const result = condition();
    if (result) {
      return result;
    }
    await sleep(interval);
  }
  return undefined;
}

/**
 * Clicks "Create New" in the requested CONTD tile and waits for the new draft to
 * appear in the store. Returns the new draft.
 */
export async function createNewDraft(ctx: ActionStepExecuteContext<unknown>, anchor: Element) {
  const assert: AssertFn = ctx.assert;
  const { log, setStatus } = ctx;
  setStatus('Looking for Create New button...');

  const findCreateBtn = () => findButton(anchor, L.ContractDrafts.actions.create());

  const createBtn = await pollUntil(findCreateBtn, 10000);
  assert(createBtn, 'Could not find "Create New" button');

  const beforeIds = new Set((contractDraftsStore.all.value ?? []).map(x => x.naturalId));
  await clickElement(createBtn);

  setStatus('Waiting for draft to be created...');
  const newDraft = await pollUntil(
    () => (contractDraftsStore.all.value ?? []).find(x => !beforeIds.has(x.naturalId)),
    8000,
  );
  assert(newDraft, 'Timed out waiting for new contract draft');
  log.info(`New draft created: ${newDraft.naturalId}`);
  return newDraft;
}

/**
 * Sets the contract name (first input) and preamble (textarea).
 */
export async function setDraftNameAndPreamble(
  ctx: ActionStepExecuteContext<unknown>,
  anchor: Element,
  name: string,
  preamble: string,
) {
  const assert: AssertFn = ctx.assert;
  const { log, setStatus } = ctx;
  setStatus('Setting contract name...');

  // Keep generated text within the contract form limits.
  name = name.length > 50 ? `${name.slice(0, 49)}…` : name;
  preamble = preamble.length > 250 ? `${preamble.slice(0, 249)}…` : preamble;

  const nameInput = await $(anchor, 'input');
  selectAndChangeInputValue(nameInput, name);
  log.info(`Name set: ${name}`);

  const preambleInput = _$(anchor, 'textarea');
  assert(preambleInput, 'Could not find preamble input');
  focusElement(preambleInput);
  changeTextAreaValue(preambleInput, preamble);
  log.info('Preamble set');
}

/**
 * Clicks the first "save" button (draft details / preamble save).
 */
export async function saveDraftDetails(
  ctx: ActionStepExecuteContext<unknown>,
  anchor: Element,
  draftId: string,
) {
  const assert: AssertFn = ctx.assert;
  const { log, setStatus } = ctx;
  setStatus('Saving draft details...');
  const before = contractDraftsStore.getByNaturalId(draftId);
  const name = _$(anchor, 'input')?.value;
  const preamble = _$(anchor, 'textarea')?.value;
  const saveBtn = findButton(anchor, L.ContractDraft.action.save());
  assert(
    saveBtn && !saveBtn.classList.contains(C.Button.disabled),
    'Draft details save button is missing or disabled',
  );
  await clickElement(saveBtn);
  const saved = await pollUntil(() => {
    const draft = contractDraftsStore.getByNaturalId(draftId);
    return (
      draft !== undefined && draft !== before && draft.name === name && draft.preamble === preamble
    );
  }, 8000);
  assert(saved, 'Draft details were not saved');
  log.info('Draft details saved');
}

/**
 * Clicks "Select Template" and returns the template type <select>.
 */
export async function openTemplate(ctx: ActionStepExecuteContext<unknown>, anchor: Element) {
  const assert: AssertFn = ctx.assert;
  const { setStatus } = ctx;
  setStatus('Opening template selection...');

  const templateBtn = await pollUntil(
    () => findButton(anchor, L.ContractDraft.action.template()),
    5000,
  );
  assert(templateBtn, 'Could not find "Select Template" button');

  await clickElement(templateBtn);

  const container = await $(anchor, C.TemplateSelection.templateTypeSelect);
  const select = _$(container, 'select');
  assert(select, 'Could not find template type select');
  return select;
}

// Maps stored action values to the game's select option values.
const templateValueMap: Record<string, string> = {
  BUYING: 'BUY',
  SELLING: 'SELL',
};

export function selectTemplateType(
  ctx: ActionStepExecuteContext<unknown>,
  select: HTMLSelectElement,
  value: string,
) {
  const assert: AssertFn = ctx.assert;
  const { log } = ctx;
  const mapped = templateValueMap[value] ?? value;
  const idx = Array.from(select.options).findIndex(x => x.value === mapped);
  assert(idx >= 0, `Template "${value}" not found in select`);
  changeSelectIndex(select, idx);
  log.info(`Selected "${value}" template`);
}

export async function setCurrency(
  ctx: ActionStepExecuteContext<unknown>,
  anchor: Element,
  currency: string,
) {
  const assert: AssertFn = ctx.assert;
  const { log } = ctx;
  const findCurrencySelect = () =>
    _$$(anchor, 'select').find(x => Array.from(x.options).some(opt => opt.value === currency));

  const select = await pollUntil(findCurrencySelect, 3000);
  assert(select, `Could not find currency select for ${currency}`);
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
  ctx: ActionStepExecuteContext<unknown>,
  anchor: Element,
  materials: MaterialEntry[],
  options?: AddMaterialsOptions,
) {
  const assert: AssertFn = ctx.assert;
  const { log, setStatus } = ctx;
  setStatus('Adding materials to template...');

  const findAddButton = () =>
    _$$(anchor, 'button').find(x => {
      return (
        isText(L.TemplateSelection.action.addShipment())(x) ||
        isText(L.TemplateSelection.action.addCommodity())(x)
      );
    });

  for (let i = 0; i < materials.length; i++) {
    const mat = materials[i];

    if (i > 0) {
      const addBtn = findAddButton();
      assert(addBtn, `Could not find add button for ${mat.ticker}`);
      await clickElement(addBtn);
    }

    const group = await pollUntil(() => _$$(anchor, C.TemplateSelection.group).at(i), 2000);
    assert(group, `Could not find group for ${mat.ticker}`);

    const amountInput = group.querySelector<HTMLInputElement>('input[inputmode="numeric"]');
    assert(amountInput, `Could not find amount input for ${mat.ticker}`);
    selectAndChangeInputValue(amountInput, String(mat.amount));

    const matSelector = _$(group, C.MaterialSelector.container);
    assert(matSelector, `Could not find material selector for ${mat.ticker}`);
    const selected = await selectMaterialInMaterialSelector(matSelector, mat.ticker);
    assert(selected, `Could not select material ${mat.ticker}`);
    await sleep(200);
    log.info(`Added: ${mat.ticker} x${fixed0(mat.amount)}`);

    options?.setPrice?.(group, mat.ticker);
  }
}

export function setDeadline(ctx: ActionStepExecuteContext<unknown>, anchor: Element, days: number) {
  const assert: AssertFn = ctx.assert;
  const { log } = ctx;
  assert(Number.isInteger(days) && days >= 1 && days <= 99, 'Deadline must be from 1 to 99 days');

  const input = anchor.querySelector<HTMLInputElement>('input[name="deadline"]');
  assert(input, 'Could not find deadline input');
  selectAndChangeInputValue(input, String(days));
  log.info(`Deadline set: ${fixed0(days)} days`);
}

/** Clicks "Apply Template" and waits for conditions returned by the server. */
export async function applyTemplate(
  ctx: ActionStepExecuteContext<unknown>,
  anchor: Element,
  draftId: string,
) {
  const assert: AssertFn = ctx.assert;
  const { log, setStatus } = ctx;
  setStatus('Applying template...');
  const applyBtn = await pollUntil(
    () => findButton(anchor, L.TemplateSelection.action.template()),
    5000,
  );
  assert(applyBtn, 'Could not find "Apply Template" button');
  assert(
    !applyBtn.disabled && !applyBtn.classList.contains(C.Button.disabled),
    'Template form is invalid',
  );
  const before = contractDraftsStore.getByNaturalId(draftId);
  await clickElement(applyBtn);
  const applied = await pollUntil(() => {
    const draft = contractDraftsStore.getByNaturalId(draftId);
    return draft !== undefined && draft !== before && draft.conditions.length > 0;
  }, 8000);
  assert(applied, 'Template conditions were not received');
  log.info('Template applied');
}

/** Clicks the conditions save button and waits for a valid, saved draft. */
export async function saveConditions(
  ctx: ActionStepExecuteContext<unknown>,
  anchor: Element,
  draftId: string,
) {
  const assert: AssertFn = ctx.assert;
  const { log, setStatus } = ctx;
  setStatus('Saving conditions...');
  const before = contractDraftsStore.getByNaturalId(draftId);
  const condSaveBtn = (_$$(anchor, C.Button.btn) as HTMLButtonElement[]).findLast(
    isText(L.ContractDraftSend.action.save()),
  );
  assert(
    condSaveBtn && !condSaveBtn.classList.contains(C.Button.disabled),
    'Conditions save button is missing or disabled',
  );
  await clickElement(condSaveBtn);
  const saved = await pollUntil(() => {
    const draft = contractDraftsStore.getByNaturalId(draftId);
    return (
      draft !== undefined &&
      draft !== before &&
      draft.status === 'VALID' &&
      draft.conditions.length > 0
    );
  }, 8000);
  assert(saved, 'Contract conditions were not saved');
  log.info('Conditions saved');
}
