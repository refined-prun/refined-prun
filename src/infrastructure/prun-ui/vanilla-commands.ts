import { showBuffer } from './buffers';
import { onNodeTreeMutation } from '@src/utils/on-node-tree-mutation';

export interface VanillaCommand {
  hasRequiredParameters: boolean;
}

let pending: Promise<ReadonlyMap<string, VanillaCommand>> | undefined;

export function loadVanillaCommands() {
  pending ??= fetchCommands();
  return pending;
}

async function fetchCommands() {
  try {
    return await readCommands();
  } catch (error) {
    pending = undefined;
    throw error;
  }
}

async function readCommands() {
  for (const tile of tiles.find('CMDS', true)) {
    const commands = readCommandTable(tile.anchor);
    if (commands.size > 0) {
      return commands;
    }
  }

  const done = ref(false);
  try {
    const window = await showBuffer('CMDS', { force: true, autoClose: true, closeWhen: done });
    return await waitForCommands(window);
  } finally {
    done.value = true;
  }
}

function readCommandTable(container: Element) {
  const commands = new Map<string, VanillaCommand>();
  const tbody = _$(container, 'tbody');
  if (!tbody) {
    return commands;
  }
  for (const row of _$$(tbody, 'tr')) {
    const cells = _$$(row, 'td');
    const command = cells[0]?.textContent?.trim();
    if (!command || cells[2] === undefined) {
      continue;
    }
    commands.set(command, { hasRequiredParameters: !!cells[2].textContent?.trim() });
  }
  return commands;
}

function waitForCommands(container: Element): Promise<ReadonlyMap<string, VanillaCommand>> {
  const commands = readCommandTable(container);
  if (commands.size > 0) {
    return Promise.resolve(commands);
  }
  return new Promise((resolve, reject) => {
    const stop = onNodeTreeMutation(container, () => {
      const commands = readCommandTable(container);
      if (commands.size === 0) {
        return;
      }
      clearTimeout(timeout);
      resolve(commands);
      return true;
    });
    const timeout = setTimeout(() => {
      stop();
      reject(new Error('Timed out while reading CMDS.'));
    }, 15000);
  });
}
