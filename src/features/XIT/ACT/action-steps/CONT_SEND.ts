import { act } from '@src/features/XIT/ACT/act-registry';
import { fixed0 } from '@src/utils/format';
import { changeInputValue, changeSelectIndex, focusElement } from '@src/util';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import {
  addMaterials,
  applyTemplate,
  createNewDraft,
  openTemplate,
  saveConditions,
  saveDraftDetails,
  selectLocation,
  selectTemplateType,
  setCurrency,
  setDeadline,
  setDraftNameAndPreamble,
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
  autoProvisionStoreId?: string;
}

function findPriceInput(anchor: Element) {
  const named = anchor.querySelector<HTMLInputElement>('input[name="price"]');
  if (named) {
    return named;
  }
  // Fall back to the first decimal input that's outside the per-commodity groups.
  const groups = _$$(anchor, C.TemplateSelection.group);
  return Array.from(anchor.querySelectorAll<HTMLInputElement>('input[inputmode="decimal"]')).find(
    x => !groups.some(g => g.contains(x)),
  );
}

export const CONT_SEND = act.addActionStep<Data>({
  type: 'CONT_SEND',
  description: data => {
    const materialCount = Object.keys(data.materials).length;
    const payment = data.payment !== 0 ? ` for ${fixed0(data.payment)} ${data.currency}` : '';
    return `Create contract draft (${materialCount} materials)${payment}`;
  },
  execute: async ctx => {
    const { data, log, setStatus, requestTile, waitAct, complete, assert } = ctx;

    // Compute total tonnage for the preamble and payment logging.
    let totalTonnage = 0;
    const materialDetails: Array<{ ticker: string; amount: number }> = [];
    for (const [ticker, amount] of Object.entries(data.materials)) {
      if (amount <= 0) {
        continue;
      }
      const material = materialsStore.getByTicker(ticker);
      if (!material) {
        log.warning(`Material ${ticker} not found, skipping`);
        continue;
      }
      totalTonnage += material.weight * amount;
      materialDetails.push({ ticker, amount });
    }

    if (data.payment > 0 && totalTonnage > 0) {
      log.info(
        `Total: ${totalTonnage.toFixed(2)}t, ${data.payment} ${data.currency} (${Math.round(data.payment / totalTonnage)} ${data.currency}/t)`,
      );
    }

    // Step 1: Create new draft.
    await waitAct('Create new draft?');
    const listTile = await requestTile('CONTD');
    if (!listTile) {
      return;
    }

    const newDraft = await createNewDraft(assert, log, setStatus);

    setStatus(`Loading draft ${newDraft.naturalId}...`);
    const draftTile = await requestTile(`CONTD ${newDraft.naturalId}`);
    if (!draftTile) {
      return;
    }
    const anchor = draftTile.anchor;

    const dateStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const contractName = `${data.packageName} - ${data.contDest ?? ''} - ${dateStr}`;

    const materialsList = materialDetails.map(x => `${x.ticker} x${x.amount}`).join(', ');
    const preambleText =
      data.contractNote ??
      `Shipping contract for ${totalTonnage.toFixed(2)}t.\n` +
        `Materials: ${materialsList}\n` +
        (data.payment > 0
          ? `Payment: ${data.payment} ${data.currency} (${Math.round(data.payment / totalTonnage)} ${data.currency}/t)\n`
          : '') +
        (data.daysToFulfill > 0 ? `Delivery within ${data.daysToFulfill} days` : '');

    await setDraftNameAndPreamble(anchor, log, setStatus, contractName, preambleText);

    // Step 2: Save draft details (name/preamble).
    await waitAct('Save draft details?');
    await saveDraftDetails(anchor, log, setStatus);

    const templateSelect = await openTemplate(assert, anchor, setStatus);
    selectTemplateType(log, templateSelect, 'SHIP');
    await setCurrency(anchor, log, data.currency);

    await addMaterials(anchor, log, setStatus, materialDetails);

    // The SHIP template price field is per-commodity. The game charges the
    // configured amount for each commodity row, so divide total payment by row count.
    if (data.payment > 0 && materialDetails.length > 0) {
      const pricePerCommodity = Math.round(data.payment / materialDetails.length);
      const priceInput = findPriceInput(anchor);
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

    // Step 3: Set origin address.
    const addressContainers = _$$(anchor, C.AddressSelector.container);

    if (addressContainers.length >= 1 && data.contOrigin) {
      await waitAct(`Set origin to ${data.contOrigin}?`);
      const ok = await selectLocation(addressContainers[0], data.contOrigin);
      if (ok) {
        log.info(`Origin set: ${data.contOrigin}`);
      } else {
        log.warning(`Could not select origin: ${data.contOrigin}`);
      }
    }

    // Step 4: Set destination address.
    if (addressContainers.length >= 2 && data.contDest) {
      await waitAct(`Set destination to ${data.contDest}?`);
      const ok = await selectLocation(addressContainers[1], data.contDest);
      if (ok) {
        log.info(`Destination set: ${data.contDest}`);
      } else {
        log.warning(`Could not select destination: ${data.contDest}`);
      }
    }

    if (data.autoProvisionStoreId) {
      setStatus('Setting auto-provision store...');
      const storeSelect = _$(anchor, C.StoreSelect.container) as HTMLSelectElement | undefined;
      if (storeSelect && storeSelect.options.length > 1) {
        const normalizedId = data.autoProvisionStoreId.replaceAll('-', '');
        const optionIndex = Array.from(storeSelect.options).findIndex(
          x => x.value === data.autoProvisionStoreId || x.value === normalizedId,
        );
        if (optionIndex >= 0) {
          changeSelectIndex(storeSelect, optionIndex);
          log.info(`Auto-provision store set: ${storeSelect.options[optionIndex].text}`);
        } else {
          log.warning(`Could not find auto-provision store option: ${data.autoProvisionStoreId}`);
        }
      } else {
        log.warning('Auto-provision store select did not appear');
      }
    }

    setDeadline(anchor, log, data.daysToFulfill);

    // Step 5: Apply template.
    await waitAct('Apply template?');
    await applyTemplate(assert, anchor, log, setStatus);

    // Step 6: Save conditions (after user review).
    await waitAct('Save conditions?');
    await saveConditions(anchor, log, setStatus);

    log.success(`Contract draft ${newDraft.naturalId} ready to send`);
    complete();
  },
});
