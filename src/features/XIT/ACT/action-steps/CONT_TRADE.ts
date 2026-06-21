import { act } from '@src/features/XIT/ACT/act-registry';
import { fixed0 } from '@src/utils/format';
import { changeInputValue, focusElement } from '@src/util';
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
    const { data, log, setStatus, requestTile, waitAct, complete, assert } = ctx;

    const typeLabel = data.tradeType === 'BUYING' ? 'Buy' : 'Sell';

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
    const contractName = `${data.packageName} - ${typeLabel} - ${dateStr}`;

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

    await setDraftNameAndPreamble(anchor, log, setStatus, contractName, preambleText);

    // Step 2: Save draft details (name/preamble).
    await waitAct('Save draft details?');
    await saveDraftDetails(anchor, log, setStatus);

    const templateSelect = await openTemplate(assert, anchor, setStatus);
    selectTemplateType(log, templateSelect, data.tradeType);
    await setCurrency(anchor, log, data.currency);

    const materialEntries = Object.entries(data.materials)
      .filter(([, amount]) => amount > 0)
      .map(([ticker, amount]) => ({ ticker, amount }));

    await addMaterials(anchor, log, setStatus, materialEntries, {
      setPrice: (group, ticker) => {
        const price = data.prices[ticker];
        if (price === undefined || price <= 0) {
          return;
        }
        const priceInput = group.querySelector<HTMLInputElement>('input[inputmode="decimal"]');
        if (priceInput) {
          focusElement(priceInput);
          priceInput.select();
          changeInputValue(priceInput, String(price));
          log.info(`Price for ${ticker}: ${price} ${data.currency}`);
        } else {
          log.warning(`Could not find price input for ${ticker}`);
        }
      },
    });

    // Step 3: Set location address.
    const addressContainers = _$$(anchor, C.AddressSelector.container);
    if (addressContainers.length >= 1 && data.location) {
      await waitAct(`Set location to ${data.location}?`);
      const ok = await selectLocation(addressContainers[0], data.location);
      if (ok) {
        log.info(`Location set: ${data.location}`);
      } else {
        log.warning(`Could not select location: ${data.location}`);
      }
    }

    setDeadline(anchor, log, data.daysToFulfill);

    // Step 4: Apply template.
    await waitAct('Apply template?');
    await applyTemplate(assert, anchor, log, setStatus);

    // Step 5: Save conditions (after user review).
    await waitAct('Save conditions?');
    await saveConditions(anchor, log, setStatus);

    log.success(`Contract draft ${newDraft.naturalId} ready to send`);
    complete();
  },
});
