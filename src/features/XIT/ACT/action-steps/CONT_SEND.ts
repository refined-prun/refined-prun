import { act } from '@src/features/XIT/ACT/act-registry';
import { ddmm, fixed0, fixed2 } from '@src/utils/format';
import { changeSelectIndex, selectAndChangeInputValue } from '@src/util';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { selectAddress } from '@src/infrastructure/prun-ui/utils/select-address';
import { AssertFn } from '@src/features/XIT/ACT/shared-types';
import {
  pollUntil,
  createNewDraft,
  setDraftNameAndPreamble,
  saveDraftDetails,
  openTemplate,
  selectTemplateType,
  setCurrency,
  addMaterials,
  setDeadline,
  applyTemplate,
  saveConditions,
} from '@src/features/XIT/ACT/action-steps/cont-utils';
import { billQuantities, MaterialBill } from '@src/features/XIT/ACT/material-bill';

interface Data {
  packageName: string;
  materials: MaterialBill;
  contractNote?: string;
  payment: number;
  currency: string;
  daysToFulfill: number;
  contOrigin?: string;
  contDest?: string;
  autoProvisionStoreId?: string;
}

function findPriceInput(anchor: Element) {
  const named = _$$(anchor, 'input').find(x => x.name === 'price');
  if (named) {
    return named;
  }
  const groups = _$$(anchor, C.TemplateSelection.group);
  return _$$(anchor, 'input').find(
    x => x.inputMode === 'decimal' && !groups.some(group => group.contains(x)),
  );
}

export const CONT_SEND = act.addActionStep<Data>({
  type: 'CONT_SEND',
  totalMaterials: data => billQuantities(data.materials, (_, quantity) => quantity > 0),
  description: data => {
    const materialCount = Object.keys(data.materials).length;
    const payment = data.payment !== 0 ? ` for ${fixed0(data.payment)} ${data.currency}` : '';
    return `Create contract draft (${fixed0(materialCount)} materials)${payment}`;
  },
  execute: async ctx => {
    const { data, log, setStatus, requestTile, waitAct, complete } = ctx;
    const assert: AssertFn = ctx.assert;

    // Compute total tonnage for the preamble and payment logging.
    let totalTonnage = 0;
    const materialDetails: Array<{ ticker: string; amount: number }> = [];

    for (const [ticker, { quantity: amount }] of Object.entries(data.materials)) {
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

    assert(materialDetails.length > 0, 'Material group has no materials to ship');

    if (data.payment > 0 && totalTonnage > 0) {
      log.info(
        `Total: ${fixed2(totalTonnage)}t, ${fixed0(data.payment)} ${data.currency} (${fixed0(data.payment / totalTonnage)} ${data.currency}/t)`,
      );
    }

    // Create new draft.
    const listTile = await requestTile('CONTD');
    if (!listTile) {
      return;
    }

    const newDraft = await createNewDraft(ctx, listTile);

    setStatus(`Loading draft ${newDraft.naturalId}...`);
    const draftTile = await requestTile(`CONTD ${newDraft.naturalId}`);
    if (!draftTile) {
      return;
    }
    const anchor = draftTile.anchor;

    const dateStr = ddmm();
    const contractName = `${data.packageName} - ${data.contDest ?? ''} - ${dateStr}`;

    const materialsList = materialDetails.map(x => `${x.ticker} x${fixed0(x.amount)}`).join(', ');
    const preambleText =
      data.contractNote ??
      `Shipping contract for ${fixed2(totalTonnage)}t.\n` +
        `Materials: ${materialsList}\n` +
        (data.payment > 0
          ? `Payment: ${fixed0(data.payment)} ${data.currency} (${fixed0(data.payment / totalTonnage)} ${data.currency}/t)\n`
          : '') +
        (data.daysToFulfill > 0 ? `Delivery within ${fixed0(data.daysToFulfill)} days` : '');

    await setDraftNameAndPreamble(ctx, anchor, contractName, preambleText);

    // Save draft details (name/preamble).
    await waitAct('Save draft details?');
    await saveDraftDetails(ctx, draftTile, newDraft.naturalId);

    const templateSelect = await openTemplate(ctx, anchor);
    selectTemplateType(ctx, templateSelect, 'SHIP');
    await setCurrency(ctx, anchor, data.currency);

    await addMaterials(ctx, anchor, materialDetails);

    // The SHIP template price field is per-commodity - the game charges this
    // amount for each commodity row. Divide total payment by number of commodities.
    if (data.payment > 0 && materialDetails.length > 0) {
      const pricePerCommodity = Math.round(data.payment / materialDetails.length);
      const priceInput = findPriceInput(anchor);
      assert(priceInput, 'Could not find price input');
      selectAndChangeInputValue(priceInput, String(pricePerCommodity));
      log.info(
        `Price set: ${fixed0(pricePerCommodity)} ${data.currency}/commodity x${fixed0(materialDetails.length)} = ${fixed0(pricePerCommodity * materialDetails.length)} ${data.currency} total`,
      );
    }

    // Set origin address.
    const addressContainers = _$$(anchor, C.AddressSelector.container);

    assert(
      addressContainers.length >= 1 && data.contOrigin !== undefined,
      'Could not find origin control',
    );
    await waitAct(`Set origin to ${data.contOrigin}?`);
    const originSet = await selectAddress(addressContainers[0], data.contOrigin);
    assert(originSet, `Could not select origin: ${data.contOrigin}`);
    log.info(`Origin set: ${data.contOrigin}`);

    // Set destination address.
    assert(
      addressContainers.length >= 2 && data.contDest !== undefined,
      'Could not find destination control',
    );
    await waitAct(`Set destination to ${data.contDest}?`);
    const destSet = await selectAddress(addressContainers[1], data.contDest);
    assert(destSet, `Could not select destination: ${data.contDest}`);
    log.info(`Destination set: ${data.contDest}`);

    if (data.autoProvisionStoreId !== undefined) {
      setStatus('Setting auto-provision store...');
      // The store options only populate once the origin address resolves.
      const storeSelect = await pollUntil(() => {
        const select = _$(anchor, C.StoreSelect.container) as HTMLSelectElement | undefined;
        return select !== undefined && select.options.length > 1 ? select : undefined;
      }, 5000);
      assert(storeSelect, 'Auto-provision store select did not appear');

      const normalizedId = data.autoProvisionStoreId.replaceAll('-', '');
      const optionIndex = Array.from(storeSelect.options).findIndex(
        x => x.value === data.autoProvisionStoreId || x.value === normalizedId,
      );
      assert(
        optionIndex >= 0,
        `Could not find auto-provision store option: ${data.autoProvisionStoreId}`,
      );
      changeSelectIndex(storeSelect, optionIndex);
      log.info(`Auto-provision store set: ${storeSelect.options[optionIndex].text}`);
    }

    setDeadline(ctx, anchor, data.daysToFulfill);

    // Apply template.
    await waitAct('Apply template?');
    await applyTemplate(ctx, anchor, newDraft.naturalId);

    // Save conditions, after the player has reviewed them.
    await waitAct('Save conditions?');
    await saveConditions(ctx, draftTile, newDraft.naturalId);

    log.success(`Contract draft ${newDraft.naturalId} ready to send`);
    complete();
  },
});
