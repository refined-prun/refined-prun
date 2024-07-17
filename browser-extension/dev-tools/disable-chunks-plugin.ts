/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PluginOption } from 'vite';

export function disableChunksPlugin(targets: string[] = []): PluginOption {
  return {
    name: 'disable-chunks',
    enforce: 'pre',
    async resolveId(source, importer, options): Promise<any> {
      const resolved = await this.resolve(source, importer, options);
      if (resolved && targets.some(file => resolved.id.includes(file))) {
        return `${resolved.id}?unique=${makeId(7)}`;
      }
    },
    load(id): any {
      const regex = /(\?unique=.*)$/;
      if (regex.test(id)) {
        return this.load({ id: id.replace(regex, '') });
      }
    },
  };
}

function makeId(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
