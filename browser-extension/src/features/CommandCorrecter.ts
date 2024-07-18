import { Module } from '../ModuleRunner';
import { changeValue } from '../util';
import { Selector } from '../Selector';
import { PlanetCommands } from '../GameProperties';
import planets from '@src/prun-api/planets';

export class CommandCorrecter implements Module {
  cleanup() {
    // Nothing to clean up.
    return;
  }

  run() {
    (Array.from(document.querySelectorAll(Selector.BufferArea)) as HTMLElement[]).forEach(buffer => {
      if (buffer.children.length > 1) {
        const bufferField = buffer.querySelector(Selector.BufferTextField) as HTMLInputElement;
        if (bufferField == null) {
          return;
        }
        const commandParts = bufferField.value.split(' ');
        if (PlanetCommands.includes(commandParts[0])) {
          const planet = planets.getByName(commandParts[1]);
          if (planet !== undefined) {
            commandParts[1] = planet.naturalId;
            const newCommand = commandParts.join(' ');
            bufferField.value = '';
            changeValue(bufferField, newCommand);
            if (bufferField.parentElement == null || bufferField.parentElement.parentElement == null) {
              return;
            }
            (bufferField.parentElement.parentElement as HTMLFormElement).requestSubmit();
          }
        }
      }
    });
  }
}
