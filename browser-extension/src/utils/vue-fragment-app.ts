import { App, Component, createApp, h, InjectionKey, Plugin } from 'vue';
import onElementDisconnected from '@src/utils/on-element-disconnected';

export type FragmentAppData = Record<string, unknown>;

let scope: FragmentAppScope | undefined = undefined;

export class FragmentApp {
  fragment: DocumentFragment;
  app: App;

  constructor(rootComponent: Component, rootProps?: FragmentAppData | null) {
    this.fragment = document.createDocumentFragment();
    this.app = createApp({ render: () => h(rootComponent, rootProps) });
    this.addToScope(scope);
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

  unmount() {
    this.app.unmount();
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

  addToScope(scope: FragmentAppScope | undefined) {
    scope?.add(this);
    return this;
  }
}

export class FragmentAppScope {
  apps = new Set<FragmentApp>();

  add(app: FragmentApp) {
    this.apps.add(app);
  }

  begin() {
    this.unmount();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    scope = this;
  }

  end() {
    scope = undefined;
  }

  unmount() {
    for (const app of this.apps) {
      app.unmount();
    }
    this.apps.clear();
  }
}

export function createFragmentApp(rootComponent: Component, rootProps?: FragmentAppData | null) {
  return new FragmentApp(rootComponent, rootProps);
}
