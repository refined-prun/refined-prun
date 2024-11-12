import { castArray } from '@src/utils/cast-array';

export interface XITModule {
  create_buffer();
}

interface ContextItem {
  cmd: string;
  label?: string;
}

interface CommandDescriptor {
  command: Arrayable<string>;
  name: string | ((parameters: string[]) => string);
  component?: (parameters: string[]) => Component;
  contextItems?: (parameters: string[]) => ContextItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  module?: new (...args: any[]) => XITModule;
}

const registry: Map<string, CommandDescriptor> = new Map();

function add(descriptor: CommandDescriptor) {
  for (let command of castArray(descriptor.command)) {
    command = command.toUpperCase();
    if (__DEV__ && registry.has(command)) {
      throw Error(`Duplicate command: ${command}`);
    }
    registry.set(command, descriptor);
  }
}

function get(command: string) {
  return registry.get(command.toUpperCase());
}

const command = Symbol() as InjectionKey<string>;
const parameters = Symbol() as InjectionKey<string[]>;

const xit = {
  add,
  get,
  command,
  parameters,
};

export default xit;
