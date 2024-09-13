import { h, Component, createApp, App, InjectionKey, Plugin } from 'vue';
import onElementDisconnected from '@src/utils/on-element-disconnected';

export type AppData = Record<string, unknown>;

class FragmentApp {
  fragment: DocumentFragment;
  app: App<Element>;

  constructor(rootComponent: Component, rootProps?: AppData | null) {
    this.fragment = document.createDocumentFragment();
    this.app = createApp({ render: () => h(rootComponent, rootProps) });
  }

  use<Options extends unknown[]>(plugin: Plugin<Options>, ...options: Options) {
    this.app.use(plugin, ...options);
    return this;
  }

  provide<T, K = InjectionKey<T> | string | number>(
    key: K,
    value: K extends InjectionKey<infer V> ? V : T,
  ) {
    this.app.provide(key, value);
    return this;
  }

  mount() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.app.mount(this.fragment as any);
  }

  appendTo(parent: Element) {
    const instance = this.mount();
    onElementDisconnected(parent, () => this.app.unmount());
    parent.appendChild(this.fragment);
    return instance;
  }

  before(sibling: Element) {
    const instance = this.mount();
    onElementDisconnected(sibling.parentElement!, () => this.app.unmount());
    sibling.before(this.fragment);
    return instance;
  }

  after(sibling: Element) {
    const instance = this.mount();
    onElementDisconnected(sibling.parentElement!, () => this.app.unmount());
    sibling.after(this.fragment);
    return instance;
  }
}

export function createFragmentApp(rootComponent: Component, rootProps?: AppData | null) {
  return new FragmentApp(rootComponent, rootProps);
}

export function fragmentAppAppend(
  parent: Element,
  rootComponent: Component,
  rootProps?: AppData | null,
) {
  const app = createFragmentApp(rootComponent, rootProps);
  app.appendTo(parent);
  return app.app;
}

export function fragmentAppBefore(
  sibling: Element,
  rootComponent: Component,
  rootProps?: AppData | null,
) {
  const app = createFragmentApp(rootComponent, rootProps);
  app.before(sibling);
  return app.app;
}

export function fragmentAppAfter(
  sibling: Element,
  rootComponent: Component,
  rootProps?: AppData | null,
) {
  const app = createFragmentApp(rootComponent, rootProps);
  app.after(sibling);
  return app.app;
}
