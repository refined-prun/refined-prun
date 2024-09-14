import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { _$, _$$ } from '@src/utils/get-element-by-class-name';
import { changeValue, sleep } from '@src/util';
import onElementDisconnected from '@src/utils/on-element-disconnected';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';

let isBusy = false;
const pendingResolvers: (() => void)[] = [];

export async function showBuffer(command: string, autoSubmit = true, autoClose = false) {
  await acquireSlot();
  const create = _$(PrunCss.Dock.create) as HTMLButtonElement;
  if (!create) {
    releaseSlot();
    return false;
  }

  try {
    create.click();
    await new Promise<void>(resolve => queueMicrotask(resolve));
    await captureLastWindow(command, autoSubmit, autoClose);
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
  if (pendingResolvers.length > 0) {
    setTimeout(pendingResolvers.shift()!, 0);
  } else {
    isBusy = false;
  }
}

async function captureLastWindow(command: string, autoSubmit: boolean, autoClose: boolean) {
  const windows = _$$(PrunCss.Window.window);
  if (windows.length === 0) {
    return;
  }
  const window = windows[windows.length - 1] as HTMLDivElement;
  const tile = _$(PrunCss.Tile.tile, window);
  const id = getPrunId(tile!)?.padStart(2, '0');
  if (autoClose) {
    const dock = _$$(PrunCss.Dock.buffer).find(x => _$(PrunCss.Dock.title, x)?.textContent === id);
    if (dock) {
      dock.style.display = 'none';
    }
    window.style.display = 'none';
  }
  const input = _$(PrunCss.PanelSelector.input, window) as HTMLInputElement;
  changeValue(input, command);
  const form = input.form;
  if (!form?.isConnected || !autoSubmit) {
    return;
  }
  await sleep(0);
  form.requestSubmit();
  await new Promise<void>(resolve => onElementDisconnected(input, resolve));
  if (!autoClose) {
    return;
  }
  await sleep(0);
  const buttons = _$$(PrunCss.Window.button, window);
  const closeButton = buttons.find(x => x.textContent === 'x') as HTMLButtonElement;
  if (closeButton) {
    closeButton?.click();
  }
  await new Promise<void>(resolve => onElementDisconnected(window, resolve));
}
