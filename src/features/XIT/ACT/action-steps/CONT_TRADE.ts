import { act } from '@src/features/XIT/ACT/act-registry';
import { fixed0, fixed02 } from '@src/utils/format';
import { changeInputValue, focusElement } from '@src/util';
import { AssertFn, MaterialBill } from '@src/features/XIT/ACT/shared-types';
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
  materials: MaterialBill;
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
    const { data, log, setStatus, requestTile, waitAct, waitActionFeedback, complete } = ctx;
    const assert: AssertFn = ctx.assert;

    const typeLabel = data.tradeType === 'BUYING' ? 'Buy' : 'Sell';

    // Step 1: Create new draft.
    await waitAct('Create new draft?');
    const listTile = await requestTile('CONTD');
    if (!listTile) {
      return;
    }

    const newDraft = await createNewDraft(assert, log, setStatus, listTile.anchor);
    await waitActionFeedback(listTile);

    setStatus(`Loading draft ${newDraft.naturalId}...`);
    const draftTile = await requestTile(`CONTD ${newDraft.naturalId}`);
    if (!draftTile) {
      return;
    }
    const anchor = draftTile.anchor;

    const dateStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const contractName = `${data.packageName} - ${typeLabel} - ${dateStr}`;

    const materialsList = Object.entries(data.materials)
      .map(([ticker, { quantity: amount, price }]) => {
        return price !== undefined && price > 0
          ? `${ticker} x${amount} @ ${fixed0(price)}/u`
          : `${ticker} x${amount}`;
      })
      .join(', ');
    const preambleText =
      `${typeLabel} contract.\n` +
      `Materials: ${materialsList}\n` +
      (data.daysToFulfill > 0 ? `Fulfill within ${data.daysToFulfill} days` : '');

    await setDraftNameAndPreamble(assert, anchor, log, setStatus, contractName, preambleText);

    // Step 2: Save draft details (name/preamble).
    await waitAct('Save draft details?');
    await saveDraftDetails(assert, anchor, log, setStatus, newDraft.naturalId);
    await waitActionFeedback(draftTile);

    const templateSelect = await openTemplate(assert, anchor, setStatus);
    selectTemplateType(assert, log, templateSelect, data.tradeType);
    await setCurrency(assert, anchor, log, data.currency);

    const materialEntries = Object.entries(data.materials)
      .filter(([, material]) => material.quantity > 0)
      .map(([ticker, { quantity: amount }]) => ({ ticker, amount }));

    await addMaterials(assert, anchor, log, setStatus, materialEntries, {
      setPrice: (group, ticker) => {
        const price = data.materials[ticker].price;
        assert(
          price !== undefined && Number.isFinite(price) && price >= 0.01 && price <= 100000000,
          `Invalid price for ${ticker}`,
        );
        const priceInput = group.querySelector<HTMLInputElement>('input[inputmode="decimal"]');
        assert(priceInput, `Could not find price input for ${ticker}`);
        focusElement(priceInput);
        priceInput.select();
        // Decimal inputs use the player’s locale for decimal and grouping separators.
        changeInputValue(priceInput, fixed02(price));
        log.info(`Price for ${ticker}: ${price} ${data.currency}`);
      },
    });

    // Step 3: Set location address.
    const addressContainers = _$$(anchor, C.AddressSelector.container);
    assert(addressContainers.length >= 1 && data.location, 'Could not find trade location control');
    await waitAct(`Set location to ${data.location}?`);
    const selected = await selectLocation(addressContainers[0], data.location);
    assert(selected, `Could not select location: ${data.location}`);
    log.info(`Location set: ${data.location}`);

    setDeadline(assert, anchor, log, data.daysToFulfill);

    // Step 4: Apply template.
    await waitAct('Apply template?');
    await applyTemplate(assert, anchor, log, setStatus, newDraft.naturalId);

    // Step 5: Save conditions (after user review).
    await waitAct('Save conditions?');
    await saveConditions(assert, anchor, log, setStatus, newDraft.naturalId);
    await waitActionFeedback(draftTile);

    log.success(`Contract draft ${newDraft.naturalId} ready to send`);
    complete();
  },
});
