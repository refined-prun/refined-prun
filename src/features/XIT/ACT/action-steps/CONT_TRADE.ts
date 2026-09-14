import { act } from '@src/features/XIT/ACT/act-registry';
import { ddmm, fixed0, fixed02 } from '@src/utils/format';
import { selectAndChangeInputValue } from '@src/util';
import { selectAddress } from '@src/infrastructure/prun-ui/utils/select-address';
import { AssertFn, MaterialBill } from '@src/features/XIT/ACT/shared-types';
import { isValidContractPrice } from '@src/features/XIT/ACT/actions/cont-limits';
import {
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
  totalMaterials: data =>
    Object.fromEntries(
      Object.entries(data.materials)
        .filter(([, x]) => x.quantity > 0)
        .map(([ticker, x]) => [ticker, x.quantity]),
    ),
  description: data => {
    const materialCount = Object.keys(data.materials).length;
    const typeLabel = data.tradeType === 'BUYING' ? 'Buy' : 'Sell';
    return `Create ${typeLabel} contract draft (${fixed0(materialCount)} materials)`;
  },
  execute: async ctx => {
    const { data, log, setStatus, requestTile, waitAct, complete } = ctx;
    const assert: AssertFn = ctx.assert;

    const typeLabel = data.tradeType === 'BUYING' ? 'Buy' : 'Sell';

    // Step 1: Create new draft.
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
    const contractName = `${data.packageName} - ${typeLabel} - ${dateStr}`;

    const materialsList = Object.entries(data.materials)
      .map(([ticker, { quantity: amount, price }]) => {
        return price !== undefined
          ? `${ticker} x${fixed0(amount)} @ ${fixed02(price)}/u`
          : `${ticker} x${fixed0(amount)}`;
      })
      .join(', ');
    const preambleText =
      `${typeLabel} contract.\n` +
      `Materials: ${materialsList}\n` +
      (data.daysToFulfill > 0 ? `Fulfill within ${fixed0(data.daysToFulfill)} days` : '');

    await setDraftNameAndPreamble(ctx, anchor, contractName, preambleText);

    // Save draft details (name/preamble).
    await waitAct('Save draft details?');
    await saveDraftDetails(ctx, draftTile, newDraft.naturalId);

    const templateSelect = await openTemplate(ctx, anchor);
    selectTemplateType(ctx, templateSelect, data.tradeType);
    await setCurrency(ctx, anchor, data.currency);

    // Add materials with per-material prices.
    const materialEntries = Object.entries(data.materials)
      .filter(([, x]) => x.quantity > 0)
      .map(([ticker, { quantity: amount }]) => ({ ticker, amount }));

    await addMaterials(ctx, anchor, materialEntries, {
      setPrice: (group, ticker) => {
        // Fail on a missing price to prevent a free trade.
        const price = data.materials[ticker].price;
        assert(isValidContractPrice(price), `Invalid price for ${ticker}`);
        const priceInput = _$$(group, 'input').find(x => x.inputMode === 'decimal');
        assert(priceInput, `Could not find price input for ${ticker}`);
        selectAndChangeInputValue(priceInput, fixed02(price));
        log.info(`Price for ${ticker}: ${fixed02(price)} ${data.currency}`);
      },
    });

    // Set location address.
    const addressContainers = _$$(anchor, C.AddressSelector.container);
    assert(
      addressContainers.length >= 1 && data.location.length > 0,
      'Could not find trade location control',
    );
    await waitAct(`Set location to ${data.location}?`);
    const locationSet = await selectAddress(addressContainers[0], data.location);
    assert(locationSet, `Could not select location: ${data.location}`);
    log.info(`Location set: ${data.location}`);

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
