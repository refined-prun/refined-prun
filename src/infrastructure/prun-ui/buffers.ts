import { changeValue, clickElement } from '@src/util';
import { sleep } from '@src/utils/sleep';
import css from '@src/utils/css-utils.module.css';
import onNodeDisconnected from '@src/utils/on-node-disconnected';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { watchUntil } from '@src/utils/watch';
import { isEmpty } from 'ts-extras';

let isBusy = false;
const pendingResolvers: (() => void)[] = [];

interface ShowBufferOptions {
  force?: boolean;
  autoSubmit?: boolean;
  autoClose?: boolean;
  closeWhen?: Ref<boolean>;
}

export async function showBuffer(command: string, options?: ShowBufferOptions) {
  if (!options?.force) {
    const activeTiles = tiles.find(command);
    for (const tile of activeTiles) {
      const tileWindow = tile.frame.closest(`.${C.Window.window}`) as HTMLElement;
      if (tileWindow) {
        const header = _$(tileWindow, C.Window.header);
        void clickElement(header);
        return false;
      }
    }
  }
  await acquireSlot();
  const create = await $(document.documentElement, C.Dock.create);

  try {
    create.click();
    await new Promise<void>(resolve => queueMicrotask(resolve));
    await captureLastWindow(command, options);
    return true;
  } catch {
    return false;
  } finally {
    releaseSlot();
  }
}

async function acquireSlot() {
  if (!isBusy) {
    isBusy = true;
    return;
  }

  await new Promise<void>(resolve => pendingResolvers.push(resolve));
}

function releaseSlot() {
  if (isEmpty(pendingResolvers)) {
    isBusy = false;
  } else {
    setTimeout(pendingResolvers.shift()!, 0);
  }
}

async function captureLastWindow(command: string, options?: ShowBufferOptions) {
  const windows = _$$(document, C.Window.window);
  if (isEmpty(windows)) {
    return;
  }
  const window = windows[windows.length - 1] as HTMLDivElement;
  const input = _$(window, C.PanelSelector.input) as HTMLInputElement;
  changeValue(input, command);
  const form = input.form;
  if (!form?.isConnected || !(options?.autoSubmit ?? true)) {
    return;
  }
  window.classList.add(css.hidden);
  if (options?.autoClose) {
    const tile = _$(window, C.Tile.tile);
    const id = getPrunId(tile!)?.padStart(2, '0');
    const dock = _$$(document, C.Dock.buffer).find(x => _$(x, C.Dock.title)?.textContent === id);
    if (dock) {
      dock.classList.add(css.hidden);
    }
  }
  await sleep(0);
  form.requestSubmit();
  await new Promise<void>(resolve => onNodeDisconnected(input, resolve));
  if (!options?.autoClose) {
    window.classList.remove(css.hidden);
    return;
  }
  void closeWhenDone(window, options);
}

async function closeWhenDone(window: HTMLDivElement, options?: ShowBufferOptions) {
  await sleep(0);
  const closeWhen = options?.closeWhen;
  if (closeWhen) {
    await watchUntil(closeWhen);
  }
  const buttons = _$$(window, C.Window.button);
  const closeButton = buttons.find(x => x.textContent === 'x') as HTMLButtonElement;
  if (closeButton) {
    closeButton?.click();
  }
  await new Promise<void>(resolve => onNodeDisconnected(window, resolve));
}
