import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import PlanetMenu from './PlanetMenu.vue';

let clickOutsideListener: ((e: MouseEvent) => void) | null = null;
let isOpen = false;
let menuElement: HTMLElement | null = null;

function setLocation(event: MouseEvent) {
  if (menuElement === null) {
    return;
  }
  const parentRect = menuElement.parentElement!.getBoundingClientRect();
  const menuRect = menuElement.getBoundingClientRect();
  if (event.clientX + menuRect.width > parentRect.right) {
    planetContextMenu.menuStyle.left = (parentRect.right - menuRect.width).toString() + 'px';
  } else {
    planetContextMenu.menuStyle.left = event.clientX.toString() + 'px';
  }
  planetContextMenu.menuStyle.top = (event.clientY - menuRect.height).toString() + 'px';
}

function mountMenu() {
  const container = document.getElementById('container');
  if (container?.parentElement) {
    const componentInstance = createFragmentApp(PlanetMenu).appendTo(container);
    menuElement = componentInstance.$el as HTMLElement;
  }
}

export const planetContextMenu = reactive({
  naturalId: '',
  menuStyle: {
    display: 'none',
    left: '0px',
    top: '0px',
  },
  async showMenu(event: MouseEvent, naturalId: string) {
    if (menuElement === null) {
      mountMenu();
    }
    if (clickOutsideListener !== null) {
      document.removeEventListener('click', clickOutsideListener);
      clickOutsideListener = null;
    }
    isOpen = true;
    this.naturalId = naturalId;
    this.menuStyle.display = 'block';
    await nextTick();
    setLocation(event);
    clickOutsideListener = (e: MouseEvent) => {
      if (menuElement !== null && !menuElement.contains(e.target as Node)) {
        planetContextMenu.hideMenu();
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
    void showBuffer(`${cmd} ${this.naturalId}`);
  },
});
