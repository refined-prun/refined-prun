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
import { $ } from '@src/utils/select-dom';
import {
  waitFor,
  selectLocation,
  selectMaterial,
} from '@src/features/XIT/ACT/action-steps/cont-utils';

interface Data {
  packageName: string;
  materials: Record<string, number>;
  prices: Record<string, number>;
  tradeType: 'BUYING' | 'SELLING';
  location: string;
  currency: string;
  daysToFulfill: number;
}

export const CONT_TRADE = act.addActionStep<Data>({
  type: 'CONT_TRADE',
  description: data => {
    const materialCount = Object.keys(data.materials).length;
    const typeLabel = data.tradeType === 'BUYING' ? 'Buy' : 'Sell';
    return `Create ${typeLabel} contract draft (${materialCount} materials)`;
  },
  execute: async ctx => {
    const { data, log, setStatus, requestTile, waitAct, complete, fail } = ctx;

    // Step 1: Open the CONTD tile.
    const listTile = await requestTile('CONTD');
    if (!listTile) return;

    await waitAct('Press ACT to create new draft');
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
      fail('Could not find "Create New" button in CONTD');
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

    // Set contract name.
    setStatus('Setting contract name...');
    const typeLabel = data.tradeType === 'BUYING' ? 'Buy' : 'Sell';
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const contractName = `${data.packageName} - ${typeLabel} - ${dateStr}`;

    const nameInput = (await $(draftTile.anchor, 'input')) as HTMLInputElement | null;
    if (nameInput) {
      focusElement(nameInput);
      nameInput.select();
      changeInputValue(nameInput, contractName);
      log.info(`Name set: ${contractName}`);
    } else {
      log.warning('Could not find name input');
    }

    // Set preamble.
    const materialsList = Object.entries(data.materials)
      .map(([ticker, amount]) => {
        const price = data.prices[ticker];
        return price !== undefined && price > 0
          ? `${ticker} x${amount} @ ${fixed0(price)}/u`
          : `${ticker} x${amount}`;
      })
      .join(', ');
    const preambleText =
      `${typeLabel} contract.\n` +
      `Materials: ${materialsList}\n` +
      (data.daysToFulfill > 0 ? `Fulfill within ${data.daysToFulfill} days` : '');

    const preambleInput = _$(draftTile.anchor, 'textarea') as HTMLTextAreaElement | null;
    if (preambleInput) {
      focusElement(preambleInput);
      changeTextAreaValue(preambleInput, preambleText);
      log.info('Preamble set');
    }

    // Save draft details (first save button).
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

    // Open template selection.
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

    // Select BUYING or SELLING template.
    setStatus(`Selecting ${typeLabel} commodity template...`);
    const templateTypeContainer = await $(draftTile.anchor, C.TemplateSelection.templateTypeSelect);
    const templateSelect = _$(templateTypeContainer, 'select') as HTMLSelectElement | null;
    if (!templateSelect) {
      fail('Could not find template type select');
      return;
    }

    const templateIndex = Array.from(templateSelect.options).findIndex(
      o => o.value === data.tradeType,
    );
    if (templateIndex >= 0) {
      changeSelectIndex(templateSelect, templateIndex);
    }
    log.info(`Selected "${typeLabel} commodity" template`);

    // Set currency.
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

    // Add materials with per-material prices.
    setStatus('Adding materials to template...');
    const materialEntries = Object.entries(data.materials).filter(([, amount]) => amount > 0);

    for (let i = 0; i < materialEntries.length; i++) {
      const [ticker, amount] = materialEntries[i];
      const price = data.prices[ticker];

      if (i > 0) {
        const addBtn = _$$(draftTile.anchor, 'button').find(btn => {
          const t = btn.textContent?.trim().toLowerCase();
          return t === 'add shipment' || t === 'add commodity';
        });
        if (!addBtn) {
          log.warning(`Could not find add button for ${ticker}`);
          continue;
        }
        await clickElement(addBtn);
        await waitFor(() => _$$(draftTile.anchor, C.TemplateSelection.group).length >= i + 1, 2000);
      }

      const groups = _$$(draftTile.anchor, C.TemplateSelection.group);
      const group = groups.at(-1);
      if (!group) {
        log.warning(`Could not find group for ${ticker}`);
        continue;
      }

      // Set amount.
      const amountInput = group.querySelector(
        'input[inputmode="numeric"]',
      ) as HTMLInputElement | null;
      if (amountInput) {
        focusElement(amountInput);
        amountInput.select();
        changeInputValue(amountInput, String(amount));
      }

      // Select material.
      const matSelectorContainer = _$(group, C.MaterialSelector.container);
      if (matSelectorContainer) {
        const ok = await selectMaterial(matSelectorContainer, ticker);
        if (ok) {
          log.info(`Added: ${ticker} x${amount}`);
        } else {
          log.warning(`Could not select material ${ticker}`);
        }
      }

      // Set per-material price (inside the group, after the material selector).
      if (price !== undefined && price > 0) {
        const priceInput = group.querySelector('input[name="price"]') as HTMLInputElement | null;
        if (priceInput) {
          focusElement(priceInput);
          priceInput.select();
          changeInputValue(priceInput, String(price));
          log.info(`Price for ${ticker}: ${price} ${data.currency}`);
        } else {
          log.warning(`Could not find price input for ${ticker}`);
        }
      }
    }

    // Set location (single address field for Buy/Sell).
    const addressContainers = _$$(draftTile.anchor, C.AddressSelector.container) as HTMLElement[];
    if (addressContainers.length >= 1 && data.location) {
      const ok = await selectLocation(addressContainers[0], data.location);
      if (ok) {
        log.info(`Location set: ${data.location}`);
      } else {
        log.warning(`Could not select location: ${data.location}`);
      }
    }

    // Set deadline.
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

    // Apply template.
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

    // Pause for user review before saving conditions.
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
