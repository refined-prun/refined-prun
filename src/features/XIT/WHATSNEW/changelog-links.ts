import { VanillaCommand } from '@src/infrastructure/prun-ui/vanilla-commands';

interface LinkContext {
  featureIds: ReadonlySet<string>;
  getXitCommand: (command: string) => { mandatoryParameters?: string } | undefined;
  vanillaCommands: ReadonlyMap<string, VanillaCommand>;
}

interface ChangelogPart {
  text: string;
  bold?: boolean;
  command?: string;
  autoSubmit?: boolean;
}

export function splitChangelogItem(item: string, context: LinkContext): ChangelogPart[] {
  return item.split(/(`[^`]+`)/g).map((part, index) => {
    if (index % 2 === 0) {
      return { text: part };
    }

    const text = part.slice(1, -1);
    const value = text.trim();
    if (context.featureIds.has(value)) {
      return { text, command: `XIT SET FEAT ${value}`, autoSubmit: true };
    }

    const [command, xitCommand] = value.toUpperCase().split(/\s+/);
    const descriptor =
      command === 'XIT'
        ? context.getXitCommand(xitCommand ?? 'CMDS')
        : context.vanillaCommands.get(command);
    if (!descriptor) {
      return { text, bold: true };
    }

    const hasRequiredParameters =
      'hasRequiredParameters' in descriptor
        ? descriptor.hasRequiredParameters
        : !!descriptor.mandatoryParameters;
    return {
      text,
      command: value,
      autoSubmit: !hasRequiredParameters && !/[{}<>]/.test(value),
    };
  });
}
