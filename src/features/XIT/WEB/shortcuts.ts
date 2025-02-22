import WEB from '@src/features/XIT/WEB/WEB.vue';
import { castArray } from '@src/utils/cast-array';
import { isEmpty } from 'ts-extras';

export const shortcuts = new Map<string, (parameters: string[]) => string | undefined>();

function shortcut(
  commands: string | string[],
  name: string,
  description: string,
  url: (parameters: string[]) => string | undefined,
  mandatoryParameters?: string,
  optionalParameters?: string,
) {
  xit.add({
    command: commands,
    name,
    description,
    optionalParameters,
    mandatoryParameters,
    component: () => WEB,
  });
  for (const command of castArray(commands)) {
    shortcuts.set(command.toUpperCase(), url);
  }
}

shortcut(
  'PRUN',
  'PRUN-CEPTION',
  'Opens PrUn... in PrUn!',
  () => 'https://apex.prosperousuniverse.com/',
);

shortcut('PROSPERITY', 'PROSPERITY', 'Prosperity map.', parameters => {
  let url = 'https://prosperity-prun.netlify.app/';
  if (parameters.length == 2) {
    url += `?from=${parameters[0]}&to=${parameters[1]}`;
  }
  return url;
});

shortcut(
  ['SHEET', 'SHEETS'],
  'GOOGLE SHEETS',
  'Opens Google Sheets.',
  parameters => {
    if (isEmpty(parameters)) {
      return undefined;
    }
    const documentId = parameters[0];
    let url = `https://docs.google.com/spreadsheets/d/${documentId}/edit?usp=sharing&rm=minimal`;
    const sheetId = parameters[1];
    if (sheetId) {
      url += `&gid=${sheetId}`;
    }
    return url;
  },
  'Document ID',
  'Sheet ID',
);

shortcut(['PLANNER', 'PLAN', 'PRUN PLANNER'], 'PRUN PLANNER', 'PrUn Planner.', parameters => {
  return 'https://prunplanner.org/' + parameters.join('/');
});

shortcut('MAP', "Taiyi's Map", "Taiyi's map.", () => 'https://universemap.duckdns.org/');

shortcut(
  'YAPT',
  'Yet another PrUn tool',
  'Opens the Yet Another PrUn Tool website.',
  () => 'https://aeryen23.github.io/yapt/',
);
