/* eslint-disable @typescript-eslint/no-explicit-any */

interface SystemApi {
  storage: {
    local: {
      get(
        keys?: null | string | string[] | { [key: string]: any },
      ): Promise<{ [key: string]: any }>;
      set(items: { [key: string]: any }): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
    };
  };
  runtime: {
    getURL(path: string): string;
  };
}

const system: SystemApi = __CHROME__ ? chrome : browser;
export default system;
