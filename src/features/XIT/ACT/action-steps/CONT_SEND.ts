import { act } from '@src/features/XIT/ACT/act-registry';
import { fixed0 } from '@src/utils/format';
import {
  changeInputValue,
  changeSelectIndex,
  changeTextAreaValue,
  clickElement,
  focusElement,
} from '@src/util';
import { contractDraftsStore } from '@src/infrastructure/prun-api/data/contract-drafts';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { $ } from '@src/utils/select-dom';
import {
  waitFor,
  selectLocation,
  selectMaterial,
} from '@src/features/XIT/ACT/action-steps/cont-utils';

interface Data {
  packageName: string;
  materials: Record<string, number>;
  contractNote?: string;
  payment: number;
  currency: string;
  daysToFulfill: number;
  contOrigin?: string;
  contDest?: string;
}

export const CONT_SEND = act.addActionStep<Data>({
  type: 'CONT_SEND',
  description: data => {
    const materialCount = Object.keys(data.materials).length;
    const payment = data.payment !== 0 ? ` for ${fixed0(data.payment)} ${data.currency}` : '';
    return `Create contract draft (${materialCount} materials)${payment}`;
  },
  execute: async ctx => {
    const { data, log, setStatus, requestTile, waitAct, complete, fail } = ctx;

    const listTile = await requestTile('CONTD');
    if (!listTile) return;

    setStatus('Creating new contract draft...');

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
      return;
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
      return;
    }

    const newDraft = (contractDraftsStore.all.value ?? []).find(d => !beforeIds.has(d.naturalId))!;
    log.info(`New draft created: ${newDraft.naturalId}`);

    setStatus(`Loading draft ${newDraft.naturalId}...`);
    const draftTile = await requestTile(`CONTD ${newDraft.naturalId}`);
    if (!draftTile) return;

    // Calculate total tonnage for the preamble and payment logging.
    // material.weight is in the same unit as weightCapacity (tonnes).
    let totalTonnage = 0;
    const materialDetails: Array<{ ticker: string; amount: number; tonnage: number }> = [];

    for (const [ticker, rawAmount] of Object.entries(data.materials)) {
      const qty = rawAmount as number;
      if (qty <= 0) continue;
      const material = materialsStore.getByTicker(ticker);
      if (!material) {
        log.warning(`Material ${ticker} not found, skipping`);
        continue;
      }
      const t = material.weight * qty;
      totalTonnage += t;
      materialDetails.push({ ticker, amount: qty, tonnage: t });
    }

    if (data.payment > 0 && totalTonnage > 0) {
      log.info(
        `Total: ${totalTonnage.toFixed(2)}t, ${data.payment} ${data.currency} (${Math.round(data.payment / totalTonnage)} ${data.currency}/t)`,
      );
    }

    setStatus('Setting contract name...');

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const contractName = `${data.packageName} - ${data.contDest ?? ''} - ${dateStr}`;

    const nameInput = (await $(draftTile.anchor, 'input')) as HTMLInputElement | null;
    if (nameInput) {
      focusElement(nameInput);
      nameInput.select();
      changeInputValue(nameInput, contractName);
      log.info(`Name set: ${contractName}`);
    } else {
      log.warning('Could not find name input');
    }

    const materialsList = materialDetails.map(m => `${m.ticker} x${m.amount}`).join(', ');
    const preambleText =
      data.contractNote ||
      `Shipping contract for ${totalTonnage.toFixed(2)}t.\n` +
        `Materials: ${materialsList}\n` +
        (data.payment > 0
          ? `Payment: ${data.payment} ${data.currency} (${Math.round(data.payment / totalTonnage)} ${data.currency}/t)\n`
          : '') +
        (data.daysToFulfill > 0 ? `Delivery within ${data.daysToFulfill} days` : '');

    const preambleInput = _$(draftTile.anchor, 'textarea') as HTMLTextAreaElement | null;
    if (preambleInput) {
      focusElement(preambleInput);
      changeTextAreaValue(preambleInput, preambleText);
      log.info('Preamble set');
    }

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
      return;
    }
    const selectTemplateBtn = _$$(draftTile.anchor, 'button').find(
      btn => btn.textContent?.trim().toLowerCase() === 'select template',
    )!;
    await clickElement(selectTemplateBtn);

    setStatus('Selecting Ship commodity template...');

    const templateTypeContainer = await $(draftTile.anchor, C.TemplateSelection.templateTypeSelect);
    const templateSelect = _$(templateTypeContainer, 'select') as HTMLSelectElement | null;
    if (!templateSelect) {
      fail('Could not find template type select');
      return;
    }

    const shipIndex = Array.from(templateSelect.options).findIndex(o => o.value === 'SHIP');
    if (shipIndex >= 0) {
      changeSelectIndex(templateSelect, shipIndex);
    }
    log.info('Selected "Ship commodity" template');

    const currencySelectFound = await waitFor(() => {
      const selects = _$$(draftTile.anchor, 'select') as HTMLSelectElement[];
      return selects.some(s => Array.from(s.options).some(o => o.value === data.currency));
    }, 3000);

    if (currencySelectFound) {
      const selects = _$$(draftTile.anchor, 'select') as HTMLSelectElement[];
      const currencySelect = selects.find(s =>
        Array.from(s.options).some(o => o.value === data.currency),
      )!;
      const currencyIndex = Array.from(currencySelect.options).findIndex(
        o => o.value === data.currency,
      );
      if (currencyIndex >= 0) {
        changeSelectIndex(currencySelect, currencyIndex);
      }
      log.info(`Currency set to ${data.currency}`);
    } else {
      log.warning(`Could not find currency select for ${data.currency}`);
    }

    setStatus('Adding materials to template...');

    for (let i = 0; i < materialDetails.length; i++) {
      const mat = materialDetails[i];

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
    }

    // The SHIP template price field is per-commodity — the game charges this
    // amount for each commodity row. Divide total payment by number of commodities.
    if (data.payment > 0 && materialDetails.length > 0) {
      const pricePerCommodity = Math.round(data.payment / materialDetails.length);
      const priceInput = draftTile.anchor.querySelector(
        'input[name="price"]',
      ) as HTMLInputElement | null;
      if (priceInput) {
        focusElement(priceInput);
        priceInput.select();
        changeInputValue(priceInput, String(pricePerCommodity));
        log.info(
          `Price set: ${pricePerCommodity} ${data.currency}/commodity x${materialDetails.length} = ${pricePerCommodity * materialDetails.length} ${data.currency} total`,
        );
      } else {
        log.warning('Could not find price input');
      }
    }

    const addressContainers = _$$(draftTile.anchor, C.AddressSelector.container) as HTMLElement[];

    if (addressContainers.length >= 1 && data.contOrigin) {
      const ok = await selectLocation(addressContainers[0], data.contOrigin);
      if (ok) {
        log.info(`Origin set: ${data.contOrigin}`);
      } else {
        log.warning(`Could not select origin: ${data.contOrigin}`);
      }
    }
    if (addressContainers.length >= 2 && data.contDest) {
      const ok = await selectLocation(addressContainers[1], data.contDest);
      if (ok) {
        log.info(`Destination set: ${data.contDest}`);
      } else {
        log.warning(`Could not select destination: ${data.contDest}`);
      }
    }

    if (data.daysToFulfill > 0) {
      const deadlineInput = draftTile.anchor.querySelector(
        'input[name="deadline"]',
      ) as HTMLInputElement | null;
      if (deadlineInput) {
        focusElement(deadlineInput);
        deadlineInput.select();
        changeInputValue(deadlineInput, String(data.daysToFulfill));
        log.info(`Deadline set: ${data.daysToFulfill} days`);
      }
    }

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
      return;
    }
    const applyBtn = _$$(draftTile.anchor, 'button').find(
      btn => btn.textContent?.trim().toLowerCase() === 'apply template',
    )!;

    await clickElement(applyBtn);
    await waitFor(() => applyBtn.classList.contains(C.Button.disabled), 3000);
    await waitFor(() => !applyBtn.classList.contains(C.Button.disabled), 5000);
    log.info('Template applied');

    // Pause so the user can review the filled contract before it is saved.
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

    log.success(`Contract draft ${newDraft.naturalId} ready to send`);
    complete();
  },
});
