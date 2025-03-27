export {};
declare global {
  const $$: typeof import('@src/utils/select-dom')['$$'];
  const $: typeof import('@src/utils/select-dom')['$'];
  const C: typeof import('@src/infrastructure/prun-ui/prun-css')['C'];
  const EffectScope: typeof import('vue')['EffectScope'];
  const _$$: typeof import('@src/utils/select-dom')['_$$'];
  const _$: typeof import('@src/utils/select-dom')['_$'];
  const applyCssRule: typeof import('@src/infrastructure/prun-ui/refined-prun-css')['applyCssRule'];
  const computed: typeof import('vue')['computed'];
  const config: typeof import('@src/infrastructure/shell/config')['default'];
  const createApp: typeof import('vue')['createApp'];
  const createFragmentApp: typeof import('@src/utils/vue-fragment-app')['createFragmentApp'];
  const customRef: typeof import('vue')['customRef'];
  const defineAsyncComponent: typeof import('vue')['defineAsyncComponent'];
  const defineComponent: typeof import('vue')['defineComponent'];
  const effectScope: typeof import('vue')['effectScope'];
  const features: typeof import('@src/features/feature-registry')['default'];
  const getCurrentInstance: typeof import('vue')['getCurrentInstance'];
  const getCurrentScope: typeof import('vue')['getCurrentScope'];
  const h: typeof import('vue')['h'];
  const inject: typeof import('vue')['inject'];
  const isProxy: typeof import('vue')['isProxy'];
  const isReactive: typeof import('vue')['isReactive'];
  const isReadonly: typeof import('vue')['isReadonly'];
  const isRef: typeof import('vue')['isRef'];
  const markRaw: typeof import('vue')['markRaw'];
  const nextTick: typeof import('vue')['nextTick'];
  const onActivated: typeof import('vue')['onActivated'];
  const onBeforeMount: typeof import('vue')['onBeforeMount'];
  const onBeforeUnmount: typeof import('vue')['onBeforeUnmount'];
  const onBeforeUpdate: typeof import('vue')['onBeforeUpdate'];
  const onDeactivated: typeof import('vue')['onDeactivated'];
  const onErrorCaptured: typeof import('vue')['onErrorCaptured'];
  const onMounted: typeof import('vue')['onMounted'];
  const onRenderTracked: typeof import('vue')['onRenderTracked'];
  const onRenderTriggered: typeof import('vue')['onRenderTriggered'];
  const onScopeDispose: typeof import('vue')['onScopeDispose'];
  const onServerPrefetch: typeof import('vue')['onServerPrefetch'];
  const onUnmounted: typeof import('vue')['onUnmounted'];
  const onUpdated: typeof import('vue')['onUpdated'];
  const onWatcherCleanup: typeof import('vue')['onWatcherCleanup'];
  const provide: typeof import('vue')['provide'];
  const reactive: typeof import('vue')['reactive'];
  const readonly: typeof import('vue')['readonly'];
  const ref: typeof import('vue')['ref'];
  const resolveComponent: typeof import('vue')['resolveComponent'];
  const shallowReactive: typeof import('vue')['shallowReactive'];
  const shallowReadonly: typeof import('vue')['shallowReadonly'];
  const shallowRef: typeof import('vue')['shallowRef'];
  const subscribe: typeof import('@src/utils/subscribe-async-generator')['subscribe'];
  const tiles: typeof import('@src/infrastructure/prun-ui/tiles')['default'];
  const toRaw: typeof import('vue')['toRaw'];
  const toRef: typeof import('vue')['toRef'];
  const toRefs: typeof import('vue')['toRefs'];
  const toValue: typeof import('vue')['toValue'];
  const triggerRef: typeof import('vue')['triggerRef'];
  const unref: typeof import('vue')['unref'];
  const useAttrs: typeof import('vue')['useAttrs'];
  const useCssModule: typeof import('vue')['useCssModule'];
  const useCssVars: typeof import('vue')['useCssVars'];
  const useId: typeof import('vue')['useId'];
  const useModel: typeof import('vue')['useModel'];
  const useSlots: typeof import('vue')['useSlots'];
  const useTemplateRef: typeof import('vue')['useTemplateRef'];
  const watch: typeof import('vue')['watch'];
  const watchEffect: typeof import('vue')['watchEffect'];
  const watchPostEffect: typeof import('vue')['watchPostEffect'];
  const watchSyncEffect: typeof import('vue')['watchSyncEffect'];
  const xit: typeof import('@src/features/XIT/xit-registry')['default'];
}
// for type re-export
declare global {
  // @ts-ignore
  export type {
    Component,
    ComponentPublicInstance,
    ComputedRef,
    DirectiveBinding,
    ExtractDefaultPropTypes,
    ExtractPropTypes,
    ExtractPublicPropTypes,
    InjectionKey,
    PropType,
    Ref,
    MaybeRef,
    MaybeRefOrGetter,
    VNode,
    WritableComputedRef,
  } from 'vue';
  import('vue');
}
// for vue template auto import
import { UnwrapRef } from 'vue';

declare module 'vue' {
  interface ComponentCustomProperties {
    readonly $$: UnwrapRef<typeof import('@src/utils/select-dom')['$$']>;
    readonly $: UnwrapRef<typeof import('@src/utils/select-dom')['$']>;
    readonly C: UnwrapRef<typeof import('@src/infrastructure/prun-ui/prun-css')['C']>;
    readonly EffectScope: UnwrapRef<typeof import('vue')['EffectScope']>;
    readonly _$$: UnwrapRef<typeof import('@src/utils/select-dom')['_$$']>;
    readonly _$: UnwrapRef<typeof import('@src/utils/select-dom')['_$']>;
    readonly applyCssRule: UnwrapRef<typeof import('@src/infrastructure/prun-ui/refined-prun-css')['applyCssRule']>;
    readonly computed: UnwrapRef<typeof import('vue')['computed']>;
    readonly config: UnwrapRef<typeof import('@src/infrastructure/shell/config')['default']>;
    readonly createApp: UnwrapRef<typeof import('vue')['createApp']>;
    readonly createFragmentApp: UnwrapRef<typeof import('@src/utils/vue-fragment-app')['createFragmentApp']>;
    readonly customRef: UnwrapRef<typeof import('vue')['customRef']>;
    readonly defineAsyncComponent: UnwrapRef<typeof import('vue')['defineAsyncComponent']>;
    readonly defineComponent: UnwrapRef<typeof import('vue')['defineComponent']>;
    readonly effectScope: UnwrapRef<typeof import('vue')['effectScope']>;
    readonly features: UnwrapRef<typeof import('@src/features/feature-registry')['default']>;
    readonly getCurrentInstance: UnwrapRef<typeof import('vue')['getCurrentInstance']>;
    readonly getCurrentScope: UnwrapRef<typeof import('vue')['getCurrentScope']>;
    readonly h: UnwrapRef<typeof import('vue')['h']>;
    readonly inject: UnwrapRef<typeof import('vue')['inject']>;
    readonly isProxy: UnwrapRef<typeof import('vue')['isProxy']>;
    readonly isReactive: UnwrapRef<typeof import('vue')['isReactive']>;
    readonly isReadonly: UnwrapRef<typeof import('vue')['isReadonly']>;
    readonly isRef: UnwrapRef<typeof import('vue')['isRef']>;
    readonly markRaw: UnwrapRef<typeof import('vue')['markRaw']>;
    readonly nextTick: UnwrapRef<typeof import('vue')['nextTick']>;
    readonly onActivated: UnwrapRef<typeof import('vue')['onActivated']>;
    readonly onBeforeMount: UnwrapRef<typeof import('vue')['onBeforeMount']>;
    readonly onBeforeUnmount: UnwrapRef<typeof import('vue')['onBeforeUnmount']>;
    readonly onBeforeUpdate: UnwrapRef<typeof import('vue')['onBeforeUpdate']>;
    readonly onDeactivated: UnwrapRef<typeof import('vue')['onDeactivated']>;
    readonly onErrorCaptured: UnwrapRef<typeof import('vue')['onErrorCaptured']>;
    readonly onMounted: UnwrapRef<typeof import('vue')['onMounted']>;
    readonly onRenderTracked: UnwrapRef<typeof import('vue')['onRenderTracked']>;
    readonly onRenderTriggered: UnwrapRef<typeof import('vue')['onRenderTriggered']>;
    readonly onScopeDispose: UnwrapRef<typeof import('vue')['onScopeDispose']>;
    readonly onServerPrefetch: UnwrapRef<typeof import('vue')['onServerPrefetch']>;
    readonly onUnmounted: UnwrapRef<typeof import('vue')['onUnmounted']>;
    readonly onUpdated: UnwrapRef<typeof import('vue')['onUpdated']>;
    readonly onWatcherCleanup: UnwrapRef<typeof import('vue')['onWatcherCleanup']>;
    readonly provide: UnwrapRef<typeof import('vue')['provide']>;
    readonly reactive: UnwrapRef<typeof import('vue')['reactive']>;
    readonly readonly: UnwrapRef<typeof import('vue')['readonly']>;
    readonly ref: UnwrapRef<typeof import('vue')['ref']>;
    readonly resolveComponent: UnwrapRef<typeof import('vue')['resolveComponent']>;
    readonly shallowReactive: UnwrapRef<typeof import('vue')['shallowReactive']>;
    readonly shallowReadonly: UnwrapRef<typeof import('vue')['shallowReadonly']>;
    readonly shallowRef: UnwrapRef<typeof import('vue')['shallowRef']>;
    readonly subscribe: UnwrapRef<typeof import('@src/utils/subscribe-async-generator')['subscribe']>;
    readonly tiles: UnwrapRef<typeof import('@src/infrastructure/prun-ui/tiles')['default']>;
    readonly toRaw: UnwrapRef<typeof import('vue')['toRaw']>;
    readonly toRef: UnwrapRef<typeof import('vue')['toRef']>;
    readonly toRefs: UnwrapRef<typeof import('vue')['toRefs']>;
    readonly toValue: UnwrapRef<typeof import('vue')['toValue']>;
    readonly triggerRef: UnwrapRef<typeof import('vue')['triggerRef']>;
    readonly unref: UnwrapRef<typeof import('vue')['unref']>;
    readonly useAttrs: UnwrapRef<typeof import('vue')['useAttrs']>;
    readonly useCssModule: UnwrapRef<typeof import('vue')['useCssModule']>;
    readonly useCssVars: UnwrapRef<typeof import('vue')['useCssVars']>;
    readonly useId: UnwrapRef<typeof import('vue')['useId']>;
    readonly useModel: UnwrapRef<typeof import('vue')['useModel']>;
    readonly useSlots: UnwrapRef<typeof import('vue')['useSlots']>;
    readonly useTemplateRef: UnwrapRef<typeof import('vue')['useTemplateRef']>;
    readonly watch: UnwrapRef<typeof import('vue')['watch']>;
    readonly watchEffect: UnwrapRef<typeof import('vue')['watchEffect']>;
    readonly watchPostEffect: UnwrapRef<typeof import('vue')['watchPostEffect']>;
    readonly watchSyncEffect: UnwrapRef<typeof import('vue')['watchSyncEffect']>;
    readonly xit: UnwrapRef<typeof import('@src/features/XIT/xit-registry')['default']>;
  }
}
