import WEB from '@src/features/XIT/WEB/WEB.vue';
import { castArray } from '@src/utils/cast-array';
import { isEmpty } from 'ts-extras';

export const shortcuts = new Map<string, (parameters: string[]) => string | undefined>();

interface Shortcut {
  command: string | string[];
  name: string;
  description: string;
  url: (parameters: string[]) => string | undefined;
  mandatoryParameters?: string;
  optionalParameters?: string;
  bufferSize?: [number, number];
}

function shortcut(shortcut: Shortcut) {
  xit.add({
    ...shortcut,
    component: () => WEB,
  });
  for (const command of castArray(shortcut.command)) {
    shortcuts.set(command.toUpperCase(), shortcut.url);
  }
}

shortcut({
  command: 'PRUN',
  name: 'PRUN-CEPTION',
  description: 'Opens PrUn... in PrUn!',
  url: () => 'https://apex.prosperousuniverse.com/',
});

shortcut({
  command: 'PROSPERITY',
  name: 'PROSPERITY',
  description: 'Prosperity map.',
  url: parameters => {
    let url = 'https://prosperity-prun.netlify.app/';
    if (parameters.length == 2) {
      url += `?from=${parameters[0]}&to=${parameters[1]}`;
    }
    return url;
  },
});

shortcut({
  command: ['SHEET', 'SHEETS'],
  name: 'GOOGLE SHEETS',
  description: 'Opens Google Sheets.',
  url: parameters => {
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
  mandatoryParameters: 'Document ID',
  optionalParameters: 'Sheet ID',
});

shortcut({
  command: ['PLANNER', 'PLAN', 'PRUN PLANNER'],
  name: 'PRUN PLANNER',
  description: 'PrUn Planner.',
  url: parameters => {
    return 'https://prunplanner.org/' + parameters.join('/');
  },
});

shortcut({
  command: 'MAP',
  name: "Taiyi's Map",
  description: "Taiyi's map.",
  url: () => 'https://universemap.duckdns.org/',
});

shortcut({
  command: 'YAPT',
  name: 'Yet another PrUn tool',
  description: 'Opens the Yet Another PrUn Tool website.',
  url: () => 'https://aeryen23.github.io/yapt/',
  bufferSize: [1100, 700],
});

shortcut({
  command: ['PRUNSTATS', 'PRUNSTAT'],
  name: 'PrUn Financial Report',
  description: 'Opens the PrUn Financial Report website.',
  url: parameters => {
    let url =
      'https://pmmg-products.github.io/reports/?' +
      parameters.map(param => param.replace('-', '=')).join('&');
    if (parameters.length > 0) {
      url += '&';
    }
    url += 'cb=' + Date.now();
    return url;
  },
  bufferSize: [830, 680],
});
