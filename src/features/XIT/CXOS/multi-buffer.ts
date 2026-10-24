import { C } from '@src/infrastructure/prun-ui/prun-css';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { clickElement, changeInputValue, focusElement } from '@src/util';
import { sleep } from '@src/utils/sleep';
import { dispatchClientPrunMessage } from '@src/infrastructure/prun-api/prun-api-listener';
import { UI_TILES_CHANGE_COMMAND } from '@src/infrastructure/prun-api/client-messages';
import { $, _$$, _$ } from '@src/utils/select-dom';
import { watchUntil } from '@src/utils/watch';
import { showBuffer, setBufferSize } from '@src/infrastructure/prun-ui/buffers';

let detailWindow: Element | undefined;
const HORIZONTAL_SPLIT_CHAR = '–';
const EXCHANGE_CODES = ['CI1', 'NC1', 'AI1', 'IC1', 'CI2', 'NC2'];

export async function initializeDetailsWindow(): Promise<boolean> {
  if (detailWindow?.isConnected) {
    return true;
  }

  detailWindow = await showBuffer('CXOS');

  await watchUntil(() => !!_$(detailWindow!, C.Tile.tile));
  const tiles = _$$(detailWindow!, C.Tile.tile);

  const id = getPrunId(tiles[0]);
  if (id) {
    setBufferSize(id, 620, 950);
  }

  if (tiles.length === 1) {
    await splitTileHorizontal(tiles[0] as HTMLElement);
    await watchUntil(() => _$$(detailWindow!, C.Tile.tile).length >= 2);
    await sleep(150);
  }

  return true;
}

export async function openTickerDetails(ticker: string, exchange: string) {
  const alreadyOpen = detailWindow?.isConnected;
  const success = await initializeDetailsWindow();
  if (!success || !detailWindow) {
    return;
  }

  const tiles = _$$(detailWindow, C.Tile.tile);
  if (tiles.length >= 2) {
    const fullTicker = `${ticker}.${exchange}`;

    await Promise.all([
      changeTileCommand(tiles[0] as HTMLElement, 'CXOS'),
      changeTileCommand(tiles[1] as HTMLElement, `CXPO ${fullTicker}`),
    ]);

    await injectCXOSFilter(tiles[0] as HTMLElement, ticker, exchange);

    if (!alreadyOpen) {
      const header = _$(detailWindow, C.Window.header);
      if (header) {
        await clickElement(header as HTMLElement);
      }
    }
  }
}

/**
 * Configures the native CXOS tile: hides filled orders, clears old materials,
 * and filters for the target ticker and exchange.
 */
async function injectCXOSFilter(tile: HTMLElement, ticker: string, exchange: string) {
  await watchUntil(() => {
    return (
      tile.getElementsByTagName('table').length > 0 ||
      tile.textContent?.toLowerCase().includes('order types')
    );
  });

  await toggleFilledFilter(tile);
  await filterByExchange(tile, exchange);

  // Clear previous tickers to prevent filter accumulation
  const clearBtn = Array.from(tile.querySelectorAll('button')).find(el =>
    el.textContent?.toLowerCase().includes('clear material filters'),
  ) as HTMLElement | undefined;

  if (clearBtn) {
    await clickElement(clearBtn);
    await sleep(150);
  }

  let filterInput: HTMLInputElement | undefined;

  // Locate the native search/filter input
  await watchUntil(() => {
    const inputs = Array.from(tile.getElementsByTagName('input'));
    filterInput = inputs.find(
      i =>
        !i.classList.contains(C.PanelSelector.input) &&
        (i.placeholder?.toLowerCase().includes('commodity') ||
          i.type === 'search' ||
          i.type === 'text'),
    );

    if (filterInput) {
      return true;
    }

    const showBtn = Array.from(tile.querySelectorAll('span, div, button')).find(el =>
      el.textContent?.toLowerCase().includes('show filters'),
    ) as HTMLElement | undefined;
    if (showBtn) {
      clickElement(showBtn);
    }

    return false;
  });

  if (filterInput) {
    focusElement(filterInput);
    changeInputValue(filterInput, ticker);
    filterInput.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'Enter', code: 'Enter', keyCode: 13 }),
    );
  }
}

/**
 * Specifically finds the 'filled' status toggle and disables it if active.
 */
async function toggleFilledFilter(tile: HTMLElement) {
  await watchUntil(() => tile.textContent?.toLowerCase().includes('order statuses'));

  const containers = Array.from(tile.querySelectorAll(`.${C.RadioItem.container}`));
  const filledContainer = containers.find(
    el => el.textContent?.trim().toLowerCase() === 'filled',
  ) as HTMLElement | undefined;

  if (filledContainer) {
    // State is tracked on the indicator child in the RadioItem component
    const activeIndicator = filledContainer.querySelector(`.${C.RadioItem.active}`);
    if (activeIndicator) {
      await clickElement(filledContainer);
      await sleep(150);
    }
  }
}

/**
 * Isolates the target exchange by toggling off every other exchange
 * in the "Exchanges" filter section, and ensuring the target is active.
 */
async function filterByExchange(tile: HTMLElement, exchange: string) {
  await watchUntil(() => tile.textContent?.toLowerCase().includes('exchanges'));

  const containers = Array.from(tile.querySelectorAll(`.${C.RadioItem.container}`));
  const target = exchange.toUpperCase();

  for (const code of EXCHANGE_CODES) {
    const container = containers.find(el => el.textContent?.trim().toUpperCase() === code) as
      | HTMLElement
      | undefined;
    if (!container) {
      continue;
    }

    const isActive = !!container.querySelector(`.${C.RadioItem.active}`);
    const shouldBeActive = code === target;
    if (isActive !== shouldBeActive) {
      await clickElement(container);
      await sleep(50);
    }
  }
}

async function splitTileHorizontal(tile: HTMLElement): Promise<boolean> {
  const frame = _$(tile, C.TileFrame.frame);
  if (!frame) {
    return false;
  }

  await watchUntil(() => _$$(frame, C.TileControls.control).length > 0);
  const controls = _$$(frame, C.TileControls.control);
  const splitBtn = Array.from(controls).find(x => x.textContent === HORIZONTAL_SPLIT_CHAR) as
    | HTMLElement
    | undefined;

  if (splitBtn) {
    await sleep(100);
    await clickElement(splitBtn);
    return true;
  }
  return false;
}

async function changeTileCommand(tile: HTMLElement, command: string) {
  const id = getPrunId(tile);
  if (!id) {
    return;
  }

  const currentCmd = _$(tile, C.TileFrame.cmd)?.textContent?.trim().toUpperCase();
  if (currentCmd === command.toUpperCase()) {
    return;
  }

  let message = UI_TILES_CHANGE_COMMAND(id, null);
  if (!dispatchClientPrunMessage(message)) {
    const changeBtn = _$$(tile, C.TileControls.control).find(x => x.textContent === ':');
    if (changeBtn) {
      await clickElement(changeBtn as HTMLElement);
    }
  } else {
    await sleep(50);
  }

  message = UI_TILES_CHANGE_COMMAND(id, command);
  if (!dispatchClientPrunMessage(message)) {
    const input = (await $(tile, C.PanelSelector.input)) as HTMLInputElement;
    changeInputValue(input, command);
    input.form!.requestSubmit();
  }
  await sleep(100);
}
