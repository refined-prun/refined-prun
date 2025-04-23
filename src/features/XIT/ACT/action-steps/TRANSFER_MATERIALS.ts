import { act } from '@src/features/XIT/ACT/act-registry';
import { serializeStorage } from '@src/features/XIT/ACT/actions/mtra/utils';
import { fixed0 } from '@src/utils/format';
import { changeInputValue, clickElement, focusElement } from '@src/util';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { isDefined } from 'ts-extras';
import { watchWhile } from '@src/utils/watch';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';

interface Data {
  from: string;
  to: string;
  ticker: string;
  amount: number;
}

export const TRANSFER_MATERIALS = act.addActionStep<Data>({
  type: 'TRANSFER_MATERIALS',
  preProcessData: data => ({ ...data, ticker: data.ticker.toUpperCase() }),
  description: data => {
    const from = storagesStore.getById(data.from);
    const to = storagesStore.getById(data.to);
    const fromName = from ? serializeStorage(from) : 'NOT FOUND';
    const toName = to ? serializeStorage(to) : 'NOT FOUND';
    return `Transfer ${fixed0(data.amount)} ${data.ticker} from ${fromName} to ${toName}`;
  },
  execute: async ctx => {
    const { data, log, setStatus, requestTile, waitAct, waitActionFeedback, complete, skip, fail } =
      ctx;
    const { ticker } = data;
    const from = storagesStore.getById(data.from);
    const to = storagesStore.getById(data.to);
    if (!from || !to) {
      log.error('Origin or destination inventory not found');
      fail();
      return;
    }

    if (!from.items.find(x => x.quantity?.material.ticker === ticker)) {
      log.warning(`No ${ticker} was transferred (not present in origin)`);
      skip();
      return;
    }
    const material = materialsStore.getByTicker(ticker);
    if (!material) {
      log.error(`Unknown material ${ticker}`);
      fail();
      return;
    }
    const canFitWeight = material.weight <= to.weightCapacity - to.weightLoad;
    const canFitVolume = material.volume <= to.volumeCapacity - to.volumeLoad;
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
    const input = await $(container, 'input');

    const suggestionsContainer = await $(container, C.MaterialSelector.suggestionsContainer);
    focusElement(input);
    changeInputValue(input, ticker);

    const suggestionsList = _$(container, C.MaterialSelector.suggestionsList);
    if (!suggestionsList) {
      log.error(`Ticker ${ticker} not found in the material selector`);
      fail();
      return;
    }
    suggestionsContainer.style.display = 'none';
    const match = _$$(suggestionsList, C.MaterialSelector.suggestionEntry).find(
      x => _$(x, C.ColoredIcon.label)?.textContent === ticker,
    );

    if (!match) {
      suggestionsContainer.style.display = '';
      log.error(`Ticker ${ticker} not found in the material selector`);
      fail();
      return;
    }

    await clickElement(match);
    suggestionsContainer.style.display = '';

    const sliderNumbers = _$$(tile.anchor, 'rc-slider-mark-text').map(x =>
      Number(x.textContent ?? 0),
    );
    const maxAmount = Math.max(...sliderNumbers);
    const allInputs = _$$(tile.anchor, 'input');
    const amountInput = allInputs[1];
    if (amountInput === undefined) {
      log.error('Missing amount input');
      fail();
      return;
    }
    const amount = data.amount;
    if (amount > maxAmount) {
      const leftover = amount - maxAmount;
      log.warning(
        `${fixed0(leftover)} ${ticker} not transferred ` +
          `(${fixed0(maxAmount)} of ${fixed0(amount)} transferred)`,
      );
      if (maxAmount === 0) {
        skip();
        return;
      }
    }
    changeInputValue(amountInput, Math.min(amount, maxAmount).toString());

    const transferButton = await $(tile.anchor, C.Button.btn);

    await waitAct();
    const destinationAmount = computed(() => {
      const store = storagesStore.getById(data.to);
      return (
        store?.items
          .map(x => x.quantity ?? undefined)
          .filter(isDefined)
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
