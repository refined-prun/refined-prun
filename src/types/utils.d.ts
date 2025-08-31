import { AllowedComponentProps, ComponentCustomProps, VNodeProps } from 'vue';

declare global {
  export { Arrayable, PartialDeep } from 'type-fest';

  export type ExtractComponentProps<T> = T extends { new (): { $props: infer Props } }
    ? {
        -readonly [K in keyof Omit<
          Props,
          keyof VNodeProps | keyof AllowedComponentProps | keyof ComponentCustomProps
        >]: Props[K];
      }
    : never;
}
