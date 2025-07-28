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
    let documentId = parameters.join('_');
    let gid: string | undefined;
    if (documentId.length > 45) {
      const lastUnderscoreIndex = documentId.lastIndexOf('_');

      if (lastUnderscoreIndex !== -1) {
        const possibleGid = documentId.substring(lastUnderscoreIndex + 1);
        const trimmedDocumentId = documentId.substring(0, lastUnderscoreIndex);

        if (/^\d{5,12}/.test(possibleGid) && trimmedDocumentId.length > 25) {
          documentId = trimmedDocumentId;
          gid = possibleGid;
        }
      }
    }
    let url = `https://docs.google.com/spreadsheets/d/${documentId}/edit?usp=sharing&rm=minimal`;
    if (gid) {
      url += `&gid=${gid}`;
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

shortcut(
  'FINREPORT',
  'PrUn Financial Report',
  'Opens the PrUn Financial Report website.',
  parameters => {
    console.log(parameters);
    let url =
      'https://pmmg-products.github.io/reports/?' +
      parameters.map(param => param.replace('-', '=')).join('&');
    if (parameters.length > 0) {
      url += '&';
    }
    url += 'cb=' + Date.now();
    return url;
  },
);
