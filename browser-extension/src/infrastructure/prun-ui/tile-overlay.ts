import { Component } from 'vue';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { createFragmentApp, FragmentAppData } from '@src/utils/vue-fragment-app';
import Overlay from '@src/components/Overlay.vue';
import { dot } from '@src/utils/dot';
import ActionConfirmationOverlay from '@src/components/ActionConfirmationOverlay.vue';

export function showTileOverlay(
  baseElementOrEvent: Element | Event,
  component: Component,
  rootProps?: FragmentAppData | null,
) {
  const container = findMountContainer(baseElementOrEvent);
  if (!container) {
    return;
  }
  const fragmentApp = createFragmentApp(Overlay, {
    child: component,
    props: rootProps,
    onClose: () => fragmentApp.unmount(),
  });
  fragmentApp.appendTo(container);
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
  return target.closest(dot(PrunCss.TileFrame.anchor));
}
