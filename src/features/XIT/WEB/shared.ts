import xit from '@src/features/XIT/xit-registry';
import WEB from '@src/features/XIT/WEB/WEB.vue';
import { castArray } from '@src/utils/cast-array';
import { isEmpty } from 'ts-extras';

export function isValidUrl(url: string) {
  try {
    return Boolean(new URL(url));
  } catch {
    return false;
  }
}

export const shortcuts = new Map<string, (parameters: string[]) => string | undefined>();

function shortcut(
  commands: string | string[],
  name: string,
  url: (parameters: string[]) => string | undefined,
) {
  xit.add({
    command: commands,
    name: name,
    component: () => WEB,
  });
  for (const command of castArray(commands)) {
    shortcuts.set(command.toUpperCase(), url);
  }
}

shortcut('PRUN', 'PRUN-CEPTION', () => 'https://apex.prosperousuniverse.com/');

shortcut('PROSPERITY', 'PROSPERITY', parameters => {
  let url = 'https://prosperity-prun.netlify.app/';
  if (parameters.length == 2) {
    url += `?from=${parameters[0]}&to=${parameters[1]}`;
  }
  return url;
});

shortcut(['SHEET', 'SHEETS'], 'GOOGLE SHEETS', parameters => {
  if (isEmpty(parameters)) {
    return undefined;
  }
  const url = parameters.join('_');
  return `https://docs.google.com/spreadsheets/d/${url}/edit?usp=sharing&rm=minimal`;
});

shortcut(['PLANNER', 'PLAN', 'PRUN PLANNER'], 'GOOGLE SHEETS', parameters => {
  return 'https://prunplanner.org/' + parameters.join('/');
});

shortcut('MAP', "Taiyi's Map", () => 'https://universemap.duckdns.org/');
