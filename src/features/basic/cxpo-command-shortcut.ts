import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { addCommandTransformer } from '@src/features/basic/correct-commands/correct-commands';

const cxShortcuts = new Map<string, string>([
  ['a', 'AI1'],
  ['ai', 'AI1'],
  ['ai1', 'AI1'],
  ['ant', 'AI1'],
  ['antares', 'AI1'],
  ['c', 'CI1'],
  ['ci', 'CI1'],
  ['ci1', 'CI1'],
  ['b', 'CI1'],
  ['ben', 'CI1'],
  ['benten', 'CI1'],
  ['ci2', 'CI2'],
  ['l', 'CI2'],
  ['arc', 'CI2'],
  ['arcl', 'CI2'],
  ['arclight', 'CI2'],
  ['ic1', 'IC1'],
  ['i', 'IC1'],
  ['ic', 'IC1'],
  ['ic1', 'IC1'],
  ['h', 'IC1'],
  ['hor', 'IC1'],
  ['hrt', 'IC1'],
  ['hortus', 'IC1'],
  ['nc2', 'NC2'],
  ['hub', 'NC2'],
  ['hubur', 'NC2'],
  ['n', 'NC1'],
  ['nc', 'NC1'],
  ['nc1', 'NC1'],
  ['m', 'NC1'],
  ['mor', 'NC1'],
  ['moria', 'NC1'],
]);

function transform(parts: string[]) {
  const parameters = parts[0]?.toUpperCase() === 'CXPO' ? parts.slice(1) : parts;
  if (parameters.length !== 2) {
    return;
  }

  const fullTicker =
    parseFullTicker(parameters[0], parameters[1]) ?? parseFullTicker(parameters[1], parameters[0]);
  if (fullTicker === undefined) {
    return;
  }

  parts.splice(0, parts.length, 'CXPO', fullTicker);
}

function parseFullTicker(cxShortcut: string, ticker: string) {
  const cx = cxShortcuts.get(cxShortcut.toLowerCase());
  if (cx === undefined) {
    return undefined;
  }

  const material = materialsStore.getByTicker(ticker);
  if (material === undefined) {
    return undefined;
  }

  return `${material.ticker}.${cx}`;
}

function init() {
  addCommandTransformer(transform);
}

features.add(
  import.meta.url,
  init,
  'CXPO: Opens the CXPO buffer by typing an exchange shortcut and a material ticker, like "a dw" or "rat mor".',
);
