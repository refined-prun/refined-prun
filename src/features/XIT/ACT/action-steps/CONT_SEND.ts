import { act } from '@src/features/XIT/ACT/act-registry';
import { fixed0 } from '@src/utils/format';
import { changeInputValue, changeSelectIndex, focusElement } from '@src/util';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import {
  waitFor,
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
  contractNote?: string;
  payment: number;
  currency: string;
  daysToFulfill: number;
  contOrigin?: string;
  contDest?: string;
  autoProvisionStoreId?: string;
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

    const draftCtx: ContDraftContext = { draftTile: listTile, log, setStatus, fail };

    const newDraft = await createNewDraft(draftCtx);
    if (!newDraft) return;

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

    // Update context to point at the actual draft tile.
    const ctx2: ContDraftContext = { draftTile, log, setStatus, fail };

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const contractName = `${data.packageName} - ${data.contDest ?? ''} - ${dateStr}`;

    const materialsList = materialDetails.map(m => `${m.ticker} x${m.amount}`).join(', ');
    const preambleText =
      data.contractNote ||
      `Shipping contract for ${totalTonnage.toFixed(2)}t.\n` +
        `Materials: ${materialsList}\n` +
        (data.payment > 0
          ? `Payment: ${data.payment} ${data.currency} (${Math.round(data.payment / totalTonnage)} ${data.currency}/t)\n`
          : '') +
        (data.daysToFulfill > 0 ? `Delivery within ${data.daysToFulfill} days` : '');

    await setDraftNameAndPreamble(ctx2, contractName, preambleText);
    await saveDraftDetails(ctx2);

    const templateSelect = await openTemplate(ctx2);
    if (!templateSelect) return;

    selectTemplateType(ctx2, templateSelect, 'SHIP');
    await setCurrency(ctx2, data.currency);

    await addMaterials(
      ctx2,
      materialDetails.map(m => ({ ticker: m.ticker, amount: m.amount })),
    );

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

    if (data.autoProvisionStoreId) {
      setStatus('Setting auto-provision store...');
      const storeSelectReady = await waitFor(() => {
        const sel = _$(draftTile.anchor, C.StoreSelect.container) as HTMLSelectElement | null;
        return !!sel && sel.options.length > 1;
      }, 5000);
      if (storeSelectReady) {
        const storeSelect = _$(draftTile.anchor, C.StoreSelect.container) as HTMLSelectElement;
        const normalizedId = data.autoProvisionStoreId!.replaceAll('-', '');
        const optionIndex = Array.from(storeSelect.options).findIndex(
          o => o.value === data.autoProvisionStoreId || o.value === normalizedId,
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

    setDeadline(ctx2, data.daysToFulfill);

    const applied = await applyTemplate(ctx2);
    if (!applied) return;

    await saveConditions(ctx2, waitAct);

    log.success(`Contract draft ${newDraft.naturalId} ready to send`);
    complete();
  },
});
