import classes from './screen-tab-bar.module.css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import TabBar from './TabBar.vue';
import { userData } from '@src/store/user-data';
import removeArrayElement from '@src/utils/remove-array-element';
import { isDefined } from 'ts-extras';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { syncState } from '@src/features/basic/screen-tab-bar/sync';
import { applyClassCssRule, applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function onListReady(list: HTMLElement) {
  subscribe($$(list, C.ScreenControls.screen), onScreenItemReady);
  watchEffect(() => {
    syncState();
    sortScreenList(list);
  });
}

function sortScreenList(list: HTMLElement) {
  const screens = _$$(list, C.ScreenControls.screen).map(screen => {
    const name = _$(screen, C.ScreenControls.name) as HTMLAnchorElement;
    const id = extractScreenId(name.href);
    const index = id ? userData.tabs.order.indexOf(id) : -1;
    return {
      el: screen,
      index,
    };
  });
  screens.sort((a, b) => a.index - b.index);
  for (const screen of screens) {
    list.appendChild(screen.el);
  }
  list.appendChild(_$(list, C.ScreenControls.undo)!);
}

async function onScreenItemReady(item: HTMLElement) {
  const name = (await $(item, C.ScreenControls.name)) as HTMLAnchorElement;
  const id = extractScreenId(name.href)!;
  if (!isDefined(id)) {
    return;
  }
  const copy = await $(item, C.ScreenControls.copy);
  const hidden = computed(() => userData.tabs.hidden.includes(id));

  watchEffectWhileNodeAlive(name, () => {
    if (hidden.value) {
      name.classList.add(classes.hiddenName);
    } else {
      name.classList.remove(classes.hiddenName);
    }
  });

  function onClick(e: Event) {
    if (hidden.value) {
      removeArrayElement(userData.tabs.hidden, id);
    } else {
      userData.tabs.hidden.push(id);
    }
    e.stopPropagation();
    e.preventDefault();
  }

  createFragmentApp(() => (
    <div
      class={[C.ScreenControls.delete, C.ScreenControls.copy, C.type.typeSmall, classes.hideButton]}
      onClick={onClick}>
      {hidden.value ? 'shw' : 'hide'}
    </div>
  )).before(copy);
}

function extractScreenId(url?: string) {
  return url?.match(/#screen=([\w-]+)/)?.[1] ?? undefined;
}

function init() {
  subscribe($$(document, C.ScreenControls.container), container => {
    createFragmentApp(TabBar).appendTo(container);
  });
  subscribe($$(document, C.ScreenControls.screens), onListReady);
  applyClassCssRule(C.ScreenControls.container, classes.screenControls);
  applyCssRule(`.${C.ScreenControls.container} > *:not(:last-child)`, classes.screenControlsItems);
}

features.add(import.meta.url, init, 'Adds a tab bar for user screens.');
