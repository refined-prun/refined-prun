import { createFragmentApp } from '@src/utils/vue-fragment-app';
import Overlay from '@src/components/Overlay.vue';
import ActionConfirmationOverlay from '@src/components/ActionConfirmationOverlay.vue';

export function showTileOverlay<T extends Component>(
  baseElementOrEvent: Element | Event,
  component: T,
  rootProps?: ExtractComponentProps<T>,
) {
  const container = findMountContainer(baseElementOrEvent);
  if (!container) {
    return;
  }
  const scrollView = _$(container, C.ScrollView.view);
  if (!scrollView) {
    return;
  }
  const content = scrollView.children[0] as HTMLElement;
  if (content) {
    content.style.display = 'none';
  }
  const fragmentApp = createFragmentApp(Overlay, {
    child: component,
    props: rootProps,
    onClose: () => {
      fragmentApp.unmount();
      scrollView.appendChild(content);
      if (content) {
        content.style.display = '';
      }
    },
  });
  fragmentApp.appendTo(scrollView);
}

export function showConfirmationOverlay(
  baseElementOrEvent: Element | Event,
  onConfirm: () => void,
  options?: {
    message?: string;
    confirmLabel?: string;
  },
) {
  const message = options?.message ?? 'Are you sure?';
  const confirmLabel = options?.confirmLabel ?? 'Confirm';
  const container = findMountContainer(baseElementOrEvent);
  if (!container) {
    return;
  }
  const fragmentApp = createFragmentApp(ActionConfirmationOverlay, {
    message,
    confirmLabel,
    onConfirm: () => {
      fragmentApp.unmount();
      onConfirm();
    },
    onClose: () => fragmentApp.unmount(),
  });
  fragmentApp.appendTo(container);
}

function findMountContainer(baseElementOrEvent: Element | Event) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const target = (baseElementOrEvent as any).target
    ? ((baseElementOrEvent as Event).target as Element)
    : (baseElementOrEvent as Element);
  return target.closest(`.${C.TileFrame.anchor}`);
}
