import { VNode } from 'preact';
import { castArray } from '@src/utils/cast-array';

interface CommandDescriptor {
  command: Arrayable<string>;
  name: string | ((parameters: string[]) => string);
  component: (parameters: string[]) => VNode;
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

const xit = {
  add,
  get,
};

export default xit;
