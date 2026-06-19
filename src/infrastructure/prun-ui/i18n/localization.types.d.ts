import IntlMessageFormat from 'intl-messageformat';

export {};

declare global {
  interface LocalizationTree {
    [p: string]: LocalizationTree;
  }

  interface LocalizationLeaf extends LocalizationTree {
    getFormat: () => IntlMessageFormat;
  }

  interface LiteralLocalizationLeaf extends LocalizationLeaf {
    (): string;
  }

  interface ParametrizedLocalizationLeaf<T> extends LocalizationLeaf {
    (params: T): string;
  }
}
