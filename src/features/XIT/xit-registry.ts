import { castArray } from '@src/utils/cast-array';
import { initializeXitCommands } from '@src/features/XIT/xit-commands';

interface ContextItem {
  cmd: string;
  label?: string;
}

interface CommandDescriptor {
  command: Arrayable<string>;
  name: string | ((parameters: string[]) => string);
  description: string;
  mandatoryParameters?: string;
  optionalParameters?: string;
  component: (parameters: string[]) => Component;
  contextItems?: (parameters: string[]) => ContextItem[];
  bufferSize?: [number, number];
}

const registry: CommandDescriptor[] = [];
const lookup: Map<string, CommandDescriptor> = new Map();

function add(descriptor: CommandDescriptor) {
  registry.push(descriptor);
  for (let command of castArray(descriptor.command)) {
    command = command.toUpperCase();
    if (import.meta.env.DEV && lookup.has(command)) {
      throw Error(`Duplicate command: ${command}`);
    }
    lookup.set(command, descriptor);
  }
}

function get(command: string) {
  return lookup.get(command.toUpperCase());
}

const xit = {
  add,
  get,
  registry,
  init: initializeXitCommands,
};

export default xit;
