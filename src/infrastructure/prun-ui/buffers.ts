import { changeInputValue, clickElement } from '@src/util';
import { sleep } from '@src/utils/sleep';
import css from '@src/utils/css-utils.module.css';
import onNodeDisconnected from '@src/utils/on-node-disconnected';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { watchUntil } from '@src/utils/watch';
import { isEmpty } from 'ts-extras';
import { dispatchClientPrunMessage } from '@src/infrastructure/prun-api/prun-api-listener';

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

async function captureLastWindow(fullCommand: string, options?: ShowBufferOptions) {
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
    changeInputValue(input, fullCommand);
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
      newCommand: fullCommand,
    },
  };
  if (!dispatchClientPrunMessage(message)) {
    changeInputValue(input, fullCommand);
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
    const command = fullCommand.split(' ')[0];
    const defaultSize = defaultBufferSizes[command];
    if (defaultSize) {
      const message = {
        messageType: 'UI_WINDOWS_UPDATE_SIZE',
        payload: {
          id: id,
          size: {
            width: defaultSize[0],
            height: defaultSize[1],
          },
        },
      };
      dispatchClientPrunMessage(message);
    }
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

const defaultBufferSizes = {
  ADM: [380, 550],
  BBC: [500, 450],
  BLU: [550, 600],
  BS: [610, 300],
  BSC: [550, 620],
  BTF: [570, 700],
  BUI: [500, 400],
  COGC: [500, 580],
  CONT: [600, 400],
  CONTD: [450, 550],
  CONTS: [550, 300],
  CORPARC: [350, 550],
  CORPNP: [450, 430],
  CORPP: [460, 640],
  CX: [550, 600],
  CXL: [600, 180],
  CXM: [625, 300],
  CXOS: [750, 300],
  CXPO: [450, 310],
  FLT: [650, 180],
  GOV: [470, 550],
  HQ: [450, 600],
  INV: [530, 250],
  LEAD: [700, 400],
  LM: [500, 580],
  LMA: [425, 370],
  LMOS: [700, 420],
  LMP: [450, 500],
  MAT: [500, 400],
  MOTS: [600, 450],
  MU: [512, 512],
  NOTS: [425, 625],
  PLI: [450, 600],
  POPI: [550, 300],
  POPID: [460, 500],
  POPR: [515, 400],
  PROD: [400, 500],
  PRODCO: [415, 600],
  PRODQ: [650, 300],
  SHP: [450, 450],
  SHY: [450, 450],
  STEAM: [300, 450],
  STNS: [400, 280],
  SYSI: [600, 600],
  WAR: [400, 580],
  WF: [710, 300],
};
