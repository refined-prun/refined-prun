import { changeInputValue, clickElement } from '@src/util';
import { sleep } from '@src/utils/sleep';
import css from '@src/utils/css-utils.module.css';
import onNodeDisconnected from '@src/utils/on-node-disconnected';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { watchUntil } from '@src/utils/watch';
import { isEmpty } from 'ts-extras';
import { dispatchClientPrunMessage } from '@src/infrastructure/prun-api/prun-api-listener';
import { clamp } from '@src/utils/clamp';

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
  const form = input.form;
  if (!form?.isConnected) {
    return;
  }
  if (!(options?.autoSubmit ?? true)) {
    changeInputValue(input, command);
    return;
  }
  window.classList.add(css.hidden);
  const tile = _$(window, C.Tile.tile);
  const id = getPrunId(tile!);
  if (options?.autoClose) {
    const dockLabel = id?.padStart(2, '0');
    const dockTab = _$$(document, C.Dock.buffer).find(
      x => _$(x, C.Dock.title)?.textContent === dockLabel,
    );
    if (dockTab) {
      dockTab.classList.add(css.hidden);
    }
  }
  const message = {
    messageType: 'UI_TILES_CHANGE_COMMAND',
    payload: {
      id: id,
      newCommand: command,
    },
  };
  if (!dispatchClientPrunMessage(message)) {
    changeInputValue(input, command);
    await sleep(0);
    form.requestSubmit();
  }
  const selector = await $(window, C.Tile.selector);
  await Promise.any([
    new Promise<void>(resolve => onNodeDisconnected(input, resolve)),
    $(selector, C.Tile.warning),
  ]);
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

export function setBufferSize(id: string, width: number, height: number) {
  dispatchClientPrunMessage({
    messageType: 'UI_WINDOWS_UPDATE_SIZE',
    payload: {
      id: id,
      size: {
        width: clamp(width, 100, document.body.clientWidth - 50),
        height: clamp(height, 50, document.body.clientHeight - 50),
      },
    },
  });
}
