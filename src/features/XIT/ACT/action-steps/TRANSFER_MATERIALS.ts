import { act } from '@src/features/XIT/ACT/act-registry';
import { serializeStorage } from '@src/features/XIT/ACT/actions/mtra/utils';
import { fixed0 } from '@src/utils/format';
import { changeInputValue, clickElement, focusElement } from '@src/util';

interface Data {
  from: PrunApi.Store;
  to: PrunApi.Store;
  ticker: string;
  amount: number;
}

export const TRANSFER_MATERIALS = act.addActionStep<Data>({
  type: 'TRANSFER_MATERIALS',
  preProcessData: data => ({ ...data, ticker: data.ticker.toUpperCase() }),
  description: data =>
    `Transfer ${fixed0(data.amount)} ${data.ticker} ` +
    `from ${serializeStorage(data.from)} to ${serializeStorage(data.to)}`,
  execute: async ctx => {
    const { data, log, setStatus, requestTile, waitAct, waitActionFeedback, complete, fail } = ctx;

    const tile = await requestTile(
      `MTRA from-${data.from.id.substring(0, 8)} to-${data.to.id.substring(0, 8)}`,
    );
    if (!tile) {
      return;
    }

    setStatus('Setting up MTRA buffer...');
    const container = await $(tile.anchor, C.MaterialSelector.container);
    const input = await $(container, 'input');

    const ticker = data.ticker;
    const suggestionsContainer = await $(container, C.MaterialSelector.suggestionsContainer);
    focusElement(input);
    changeInputValue(input, ticker);

    const suggestionsList = await $(container, C.MaterialSelector.suggestionsList);
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
    if (!amountInput) {
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
    }
    changeInputValue(amountInput, Math.min(amount, maxAmount).toString());

    const transferButton = await $(tile.anchor, C.Button.btn);

    await waitAct();
    await clickElement(transferButton);
    await waitActionFeedback(tile);

    complete();
  },
});
