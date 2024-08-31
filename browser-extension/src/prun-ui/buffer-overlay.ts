import { Component } from 'vue';
import PrunCss from '@src/prun-ui/prun-css';
import { widgetAppend, WidgetData } from '@src/utils/vue-mount';
import Overlay from '@src/components/Overlay.vue';
import { dot } from '@src/utils/dot';
import ActionConfirmationOverlay from '@src/components/ActionConfirmationOverlay.vue';

export function showBufferOverlay(
  baseElementOrEvent: Element | Event,
  component: Component,
  rootProps?: WidgetData | null,
) {
  const container = findMountContainer(baseElementOrEvent);
  if (!container) {
    return;
  }
  const { widget } = widgetAppend(container, Overlay, {
    child: component,
    props: rootProps,
    onClose: () => widget.unmount(),
  });
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
  const { widget } = widgetAppend(container, ActionConfirmationOverlay, {
    message,
    confirmLabel,
    onConfirm: () => {
      widget.unmount();
      onConfirm();
    },
    onClose: () => widget.unmount(),
  });
}

function findMountContainer(baseElementOrEvent: Element | Event) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const target = (baseElementOrEvent as any).target
    ? ((baseElementOrEvent as Event).target as Element)
    : (baseElementOrEvent as Element);
  return (
    target.closest(dot(PrunCss.ScrollView.view)) ?? target.closest(dot(PrunCss.TileFrame.anchor))
  );
}
