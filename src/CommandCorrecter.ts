import { Module } from "./ModuleRunner";
import { changeValue } from "./util";
import { Selector } from "./Selector";
import { PlanetCommands, PlanetNames } from "./GameProperties";

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
        var bufferText = bufferField.value.toUpperCase() || "";

        if (PlanetCommands.includes(bufferText.split(" ")[0])) {
          var replaced = false;
          Object.keys(PlanetNames).forEach(name => {
            if (bufferText.includes(" " + name)) {
              bufferText = bufferText.replace(" " + name, " " + PlanetNames[name]);
              replaced = true;
            }
          });

          if (replaced) {
            bufferField.value = "";
            changeValue(bufferField, bufferText);
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

