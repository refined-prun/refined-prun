import { h, Component, createApp } from 'vue';
import onElementDisconnected from '@src/utils/on-element-disconnected';

type Data = Record<string, unknown>;

export function widgetAppend(parent: Element, component: Component, rootProps?: Data | null) {
  const fragment = document.createDocumentFragment();
  const widget = createApp({ render: () => h(component, rootProps) });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instance = widget.mount(fragment as any);
  onElementDisconnected(parent, () => widget.unmount());
  parent.appendChild(fragment);
  return { widget, instance };
}

export function widgetAfter(sibling: Element, component: Component, rootProps?: Data | null) {
  const fragment = document.createDocumentFragment();
  const widget = createApp(component, rootProps);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instance = widget.mount(fragment as any);
  onElementDisconnected(sibling.parentElement!, () => widget.unmount());
  sibling.after(fragment);
  return { widget, instance };
}

export function widgetBefore(sibling: Element, component: Component, rootProps?: Data | null) {
  const fragment = document.createDocumentFragment();
  const widget = createApp(component, rootProps);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instance = widget.mount(fragment as any);
  onElementDisconnected(sibling.parentElement!, () => widget.unmount());
  sibling.before(fragment);
  return { widget, instance };
}
