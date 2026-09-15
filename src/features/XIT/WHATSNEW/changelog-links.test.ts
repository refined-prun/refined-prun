import { describe, expect, it } from 'vitest';
import { splitChangelogItem } from './changelog-links';

const xitCommands = new Map([
  ['CMDS', {}],
  ['SET', {}],
  ['SETTINGS', {}],
  ['BURN', {}],
  ['ACT_EDIT', { mandatoryParameters: 'Package Identifier' }],
  ['NOTE', { mandatoryParameters: 'Note Identifier' }],
]);
const context = {
  featureIds: new Set(['cmds-clickable-commands', 'prun-bugs']),
  getXitCommand: (command: string) => xitCommands.get(command),
  vanillaCommands: new Map([
    ['BS', { hasRequiredParameters: false }],
    ['PROD', { hasRequiredParameters: false }],
    ['CXPO', { hasRequiredParameters: true }],
    ['XIT', { hasRequiredParameters: false }],
  ]),
};

function code(value: string) {
  return splitChangelogItem('`' + value + '`', context)[1];
}

describe('changelog links', () => {
  it('links existing feature slugs to their filtered settings', () => {
    expect(code('cmds-clickable-commands')).toEqual({
      text: 'cmds-clickable-commands',
      command: 'XIT SET FEAT cmds-clickable-commands',
      autoSubmit: true,
    });
  });

  it.each(['removed-feature', 'NOT', 'XIT REMOVED', 'const A = 1'])(
    'formats unknown backtick text as bold: %s',
    value => expect(code(value)).toEqual({ text: value, bold: true }),
  );

  it.each(['XIT', 'XIT SET', 'XIT SETTINGS FEAT prun-bugs', 'BS', 'PROD'])(
    'opens known commands without required parameters: %s',
    value => {
      expect(code(value)).toEqual({ text: value, command: value, autoSubmit: true });
    },
  );

  it.each(['XIT NOTE', 'XIT NOTE abc123', 'CXPO', 'CXPO AI1', 'PROD {planet id}'])(
    'prefills commands that need input: %s',
    value => {
      expect(code(value)).toEqual({ text: value, command: value, autoSubmit: false });
    },
  );

  it('leaves prose alone and preserves the spacing around links', () => {
    expect(splitChangelogItem('Do NOT open `XIT BURN` or `BS` yet.', context)).toEqual([
      { text: 'Do NOT open ' },
      { text: 'XIT BURN', command: 'XIT BURN', autoSubmit: true },
      { text: ' or ' },
      { text: 'BS', command: 'BS', autoSubmit: true },
      { text: ' yet.' },
    ]);
  });

  it('keeps vanilla commands bold until their existence is known', () => {
    expect(splitChangelogItem('`BS`', { ...context, vanillaCommands: new Map() })[1]).toEqual({
      text: 'BS',
      bold: true,
    });
  });
});
