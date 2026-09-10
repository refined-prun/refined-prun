import Overlay from '@src/components/Overlay.vue';
import ActionFeedback from '@src/components/ActionFeedback.vue';

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
  const content = scrollView.lastChild as HTMLElement | null;
  if (content) {
    content.style.display = 'none';
  }
  const fragmentApp = createFragmentApp(Overlay, {
    child: component,
    props: rootProps,
    onClose: () => {
      fragmentApp.unmount();
      if (content) {
        scrollView.appendChild(content);
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
  const fragmentApp = createFragmentApp(ActionFeedback, {
    status: 'confirmation',
    message,
    confirmLabel,
    onConfirm: () => {
      fragmentApp.unmount();
      onConfirm();
    },
    onDismiss: () => fragmentApp.unmount(),
  });
  fragmentApp.appendTo(container);
}

export function showErrorOverlay(baseElementOrEvent: Element | Event, message: string) {
  const container = findMountContainer(baseElementOrEvent);
  if (!container) {
    return;
  }
  const fragmentApp = createFragmentApp(ActionFeedback, {
    status: 'error',
    message,
    onDismiss: () => fragmentApp.unmount(),
  });
  fragmentApp.appendTo(container);
}

export function showSuccessOverlay(baseElementOrEvent: Element | Event, message?: string) {
  const container = findMountContainer(baseElementOrEvent);
  if (!container) {
    return;
  }
  const fragmentApp = createFragmentApp(ActionFeedback, {
    status: 'success',
    message,
    onDismiss: () => fragmentApp.unmount(),
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
