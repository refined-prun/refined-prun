import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { userData } from '@src/store/user-data';
import MarketMenu from './MarketMenu.vue';

let clickOutsideListener: ((e: MouseEvent) => void) | null = null;
let isOpen = false;
let menuElement: HTMLElement | null = null;
let materialSelector: string;

function setLocation(event: MouseEvent) {
  if (menuElement === null) {
    return;
  }
  const parentRect = menuElement.parentElement!.getBoundingClientRect();
  const menuRect = menuElement.getBoundingClientRect();
  if (event.clientX + menuRect.width > parentRect.right) {
    store.menuStyle.left = (parentRect.right - menuRect.width).toString() + 'px';
  } else {
    store.menuStyle.left = event.clientX.toString() + 'px';
  }
  if (event.clientY + menuRect.height > parentRect.bottom) {
    store.menuStyle.top = (event.clientY - menuRect.height).toString() + 'px';
  } else {
    store.menuStyle.top = event.clientY.toString() + 'px';
  }
}

export const store = reactive({
  materialID: '',
  menuStyle: {
    display: 'none',
    left: '0px',
    top: '0px',
  },
  async showMenu(event: MouseEvent, ticker: string) {
    // Clean up previous listener if rapid re-entry
    if (clickOutsideListener !== null) {
      document.removeEventListener('click', clickOutsideListener);
      clickOutsideListener = null;
    }
    isOpen = true;
    this.materialID = ticker;
    this.menuStyle.display = 'block';
    await nextTick();
    setLocation(event);
    clickOutsideListener = (e: MouseEvent) => {
      if (menuElement !== null && !menuElement.contains(e.target as Node)) {
        store.hideMenu();
      }
    };
    document.addEventListener('click', clickOutsideListener);
  },
  hideMenu() {
    if (!isOpen) {
      return;
    }
    isOpen = false;
    this.menuStyle.display = 'none';
    if (clickOutsideListener !== null) {
      document.removeEventListener('click', clickOutsideListener);
      clickOutsideListener = null;
    }
  },
  showBuffer(cmd: string) {
    this.hideMenu();
    if (cmd === 'CXM') {
      return showBuffer(`CXM ${this.materialID}`);
    } else if (['CXP', 'CXPC', 'CXPO', 'CXOB'].includes(cmd)) {
      return showBuffer(`${cmd} ${this.materialID}.${userData.settings.contextMenuExchange}`);
    }
    return;
  },
});

async function init() {
  materialSelector = `.${C.ColoredIcon.container}`;
  const container = document.getElementById('container');
  if (container?.parentElement) {
    const componentInstance = createFragmentApp(MarketMenu).appendTo(container);
    menuElement = componentInstance.$el as HTMLElement;
  }
  document.addEventListener('contextmenu', event => {
    const target = (event.target as HTMLElement).closest<HTMLElement>(materialSelector);
    if (target !== null) {
      event.preventDefault();
      store.showMenu(event, _$(target, C.ColoredIcon.label)?.textContent ?? '');
      return;
    }
    if (isOpen) {
      store.hideMenu();
    }
  });
}

features.add(
  import.meta.url,
  init,
  'Right click any material to quickly see material market buttons.',
);
