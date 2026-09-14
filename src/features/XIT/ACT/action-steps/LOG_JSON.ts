import { act } from '@src/features/XIT/ACT/act-registry';

interface Data {
  pkg: UserData.ActionPackageData;
}

export const LOG_JSON = act.addActionStep<Data>({
  type: 'LOG_JSON',
  description: data => `Print [${data.pkg.global.name}] JSON to the log`,
  execute: async ctx => {
    const { data, complete, log } = ctx;
    const name = data.pkg.global.name ?? 'package';
    log.info(`${name} JSON:`);
    log.label(JSON.stringify(data.pkg, null, 2));
    complete();
  },
});
