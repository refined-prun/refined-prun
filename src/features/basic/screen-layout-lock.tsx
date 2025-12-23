import $style from './screen-layout-lock.module.css';
import { userData } from '@src/store/user-data';
import removeArrayElement from '@src/utils/remove-array-element';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { screensStore } from '@src/infrastructure/prun-api/data/screens.ts';

function onListReady(list: HTMLElement) {
  subscribe($$(list, C.ScreenControls.screen), onScreenItemReady);
}

async function onScreenItemReady(item: HTMLElement) {
  const name = (await $(item, C.ScreenControls.name)) as HTMLAnchorElement;
  const id = extractScreenId(name.href)!;
  if (id === undefined) {
    return;
  }
  const copy = await $(item, C.ScreenControls.copy);
  const locked = computed(() => userData.tabs.locked.includes(id));

  function onClick(e: Event) {
    if (locked.value) {
      removeArrayElement(userData.tabs.locked, id);
    } else {
      userData.tabs.locked.push(id);
    }
    e.stopPropagation();
    e.preventDefault();
  }

  createFragmentApp(() => (
    <div class={[C.ScreenControls.delete, C.type.typeSmall, $style.lockButton]} onClick={onClick}>
      {locked.value ? 'unlk' : 'lock'}
    </div>
  )).before(copy);
}

function extractScreenId(url?: string) {
  return url?.match(/screen=([\w-]+)/)?.[1] ?? undefined;
}

function onFrameReady(frame: HTMLElement) {
  watchEffectWhileNodeAlive(frame, () => {
    frame.classList.toggle(
      $style.lockedScreen,
      userData.tabs.locked.includes(screensStore.current.value?.id ?? ''),
    );
  });
}

const tileControlsSymbols = ['–', '|', 'x', ':'];

async function onControlsReady(controls: HTMLElement) {
  subscribe($$(controls, C.TileControls.control), control => {
    if (tileControlsSymbols.includes(control.textContent!)) {
      control.classList.add($style.tileControl);
    }
  });
}

function init() {
  subscribe($$(document, C.ScreenControls.screens), onListReady);
  subscribe($$(document, C.Frame.main), onFrameReady);
  subscribe($$(document, C.TileControls.controls), onControlsReady);
  applyCssRule(`.${C.TileDivider.handle}`, $style.handle);
}

features.add(import.meta.url, init, 'Adds screen locking.');
