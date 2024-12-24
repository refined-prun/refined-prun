import { AllowedComponentProps, ComponentCustomProps, VNodeProps } from 'vue';

declare global {
  type Arrayable<X> = X | X[];

  type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

  type ExtractComponentProps<T> = T extends { new (): { $props: infer Props } }
    ? {
        -readonly [K in keyof Omit<
          Props,
          keyof VNodeProps | keyof AllowedComponentProps | keyof ComponentCustomProps
        >]: Props[K];
      }
    : never;
}
