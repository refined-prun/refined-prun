import { act } from '@src/features/XIT/ACT/act-registry';
import { serializeStorage } from '@src/features/XIT/ACT/actions/utils';
import { fixed0 } from '@src/utils/format';
import { changeInputValue, clickElement, selectMaterialInMaterialSelector } from '@src/util';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { watchWhile } from '@src/utils/watch';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { AssertFn } from '@src/features/XIT/ACT/shared-types';

interface Data {
  from: string;
  to: string;
  ticker: string;
  amount: number;
  // Use the live MTRA slider maximum instead of data.amount to load all available goods.
  loadAll?: boolean;
  // Prefill data.amount and delay ACT for 2s so the player can adjust it in MTRA.
  playerReview?: boolean;
}

export const MTRA_TRANSFER = act.addActionStep<Data>({
  type: 'MTRA_TRANSFER',
  preProcessData: data => ({ ...data, ticker: data.ticker.toUpperCase() }),
  totalMaterials: data => ({ [data.ticker]: data.amount }),
  description: data => {
    const from = storagesStore.getById(data.from);
    const to = storagesStore.getById(data.to);
    const fromName = from ? serializeStorage(from) : 'NOT FOUND';
    const toName = to ? serializeStorage(to) : 'NOT FOUND';
    if (data.loadAll) {
      return `Transfer all ${data.ticker} from ${fromName} to ${toName}`;
    }
    if (data.playerReview) {
      return `Transfer up to ${fixed0(data.amount)} ${data.ticker} from ${fromName} to ${toName} (adjust in MTRA)`;
    }
    return `Transfer ${fixed0(data.amount)} ${data.ticker} from ${fromName} to ${toName}`;
  },
  execute: async ctx => {
    const { data, log, setStatus, requestTile, waitAct, waitActionFeedback, complete, skip, fail } =
      ctx;
    const assert: AssertFn = ctx.assert;
    const { ticker, amount, loadAll, playerReview } = data;
    const from = storagesStore.getById(data.from);
    assert(from, 'Origin inventory not found');
    const to = storagesStore.getById(data.to);
    assert(to, 'Destination inventory not found');

    if (!from.items.find(x => x.quantity?.material.ticker === ticker)) {
      log.warning(`No ${ticker} was transferred (not present in origin)`);
      skip();
      return;
    }

    // Data.amount is only a snapshot estimate for loadAll totals/description.
    if (!loadAll && amount <= 0) {
      log.warning(`No ${ticker} was transferred (target amount is 0)`);
      skip();
      return;
    }

    const material = materialsStore.getByTicker(ticker);
    assert(material, `Unknown material ${ticker}`);

    // Check if we can fit a single unit. MTRA will be unusable otherwise.
    const epsilon = 0.000001;
    const canFitWeight = to.weightCapacity - to.weightLoad - material.weight + epsilon >= 0;
    const canFitVolume = to.volumeCapacity - to.volumeLoad - material.volume + epsilon >= 0;
    if (!canFitWeight || !canFitVolume) {
      log.warning(`No ${ticker} was transferred (no space)`);
      skip();
      return;
    }

    const tile = await requestTile(
      `MTRA from-${from.id.substring(0, 8)} to-${to.id.substring(0, 8)}`,
    );
    if (!tile) {
      return;
    }

    setStatus('Setting up MTRA buffer...');
    const container = await $(tile.anchor, C.MaterialSelector.container);

    const ok = await selectMaterialInMaterialSelector(container, ticker);
    if (!ok) {
      fail(`Ticker ${ticker} not found in the material selector`);
      return;
    }

    const sliderNumbers = _$$(tile.anchor, 'rc-slider-mark-text').map(x =>
      Number(x.textContent ?? 0),
    );
    const maxAmount = Math.max(...sliderNumbers);
    const allInputs = _$$(tile.anchor, 'input');
    const amountInput = allInputs[1];
    assert(amountInput !== undefined, 'Amount input not found');

    if (loadAll) {
      if (maxAmount === 0) {
        log.warning(`No ${ticker} was transferred (nothing available)`);
        skip();
        return;
      }
      changeInputValue(amountInput, maxAmount.toString());
    } else {
      if (amount > maxAmount) {
        if (maxAmount === 0) {
          log.warning(`No ${ticker} was transferred (nothing available)`);
          skip();
          return;
        }
        // The player still has to review the amount; do not log it as transferred yet.
        if (!playerReview) {
          const leftover = amount - maxAmount;
          log.warning(
            `${fixed0(leftover)} ${ticker} not transferred ` +
              `(${fixed0(maxAmount)} of ${fixed0(amount)} transferred)`,
          );
        }
      }
      changeInputValue(amountInput, Math.min(amount, maxAmount).toString());
    }

    const transferButton = await $(tile.anchor, C.Button.btn);

    if (playerReview) {
      await waitAct(`Adjust ${ticker} amount in MTRA, then ACT (or SKIP)`, { actDelayMs: 2000 });
      // Use whatever amount the player left in the input - do not rewrite it.
      const reviewed = Number(amountInput.value);
      if (!Number.isFinite(reviewed) || reviewed <= 0) {
        log.warning(`No ${ticker} was transferred (player amount is 0)`);
        skip();
        return;
      }
    } else {
      await waitAct();
    }

    const destinationAmount = computed(() => {
      const store = storagesStore.getById(data.to);
      return (
        store?.items
          .map(x => x.quantity ?? undefined)
          .filter(x => x !== undefined)
          .find(x => x.material.ticker === ticker)?.amount ?? 0
      );
    });
    const currentAmount = destinationAmount.value;
    await clickElement(transferButton);
    await waitActionFeedback(tile);
    setStatus('Waiting for storage update...');
    await watchWhile(() => destinationAmount.value === currentAmount);

    complete();
  },
});
