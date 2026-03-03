import { act } from '@src/features/XIT/ACT/act-registry';
import { fixed0 } from '@src/utils/format';
import { changeInputValue, focusElement } from '@src/util';
import {
  selectLocation,
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
  ContDraftContext,
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

    const draftCtx: ContDraftContext = { draftTile: listTile, log, setStatus, fail };

    const newDraft = await createNewDraft(draftCtx);
    if (!newDraft) return;

    setStatus(`Loading draft ${newDraft.naturalId}...`);
    const draftTile = await requestTile(`CONTD ${newDraft.naturalId}`);
    if (!draftTile) return;

    const ctx2: ContDraftContext = { draftTile, log, setStatus, fail };

    // Set contract name.
    const typeLabel = data.tradeType === 'BUYING' ? 'Buy' : 'Sell';
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const contractName = `${data.packageName} - ${typeLabel} - ${dateStr}`;

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

    await setDraftNameAndPreamble(ctx2, contractName, preambleText);
    await saveDraftDetails(ctx2);

    const templateSelect = await openTemplate(ctx2);
    if (!templateSelect) return;

    selectTemplateType(ctx2, templateSelect, data.tradeType);
    await setCurrency(ctx2, data.currency);

    // Add materials with per-material prices.
    const materialEntries = Object.entries(data.materials)
      .filter(([, amount]) => amount > 0)
      .map(([ticker, amount]) => ({ ticker, amount }));

    await addMaterials(ctx2, materialEntries, {
      setPrice: (group, ticker) => {
        const price = data.prices[ticker];
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
      },
    });

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

    setDeadline(ctx2, data.daysToFulfill);

    const applied = await applyTemplate(ctx2);
    if (!applied) return;

    await saveConditions(ctx2, waitAct);

    log.success(`Contract draft ${newDraft.naturalId} ready to send`);
    complete();
  },
});
