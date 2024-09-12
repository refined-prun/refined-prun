import { clearChildren } from '@src/util';
import { createSummaryScreen } from './Summary';
import { createGenerateScreen } from './Generate';
import { createExecuteScreen } from './Execute';
import xit from '@src/features/XIT/xit-registry';

export class Execute {
  private tile: HTMLElement;
  public parameters: string[];
  public name = 'ACTION PACKAGE';

  constructor(tile, parameters) {
    this.tile = tile;
    this.parameters = parameters;

    if (!parameters[1]) {
      this.name = 'ACTION PACKAGES';
    } else if (parameters[1].toLowerCase() == 'gen' || parameters[1].toLowerCase() == 'edit') {
      this.name = 'EDIT ACTION PACKAGE';
    } else {
      this.name = 'EXECUTE ACTION PACKAGE';
    }
  }

  async create_buffer() {
    clearChildren(this.tile);

    if (this.parameters.length == 1) {
      // Create table of all action packages with option to create more
      void createSummaryScreen(this.tile, this);
    } else if (
      this.parameters[1] &&
      (this.parameters[1].toLowerCase() == 'gen' || this.parameters[1].toLowerCase() == 'edit')
    ) {
      // Generate the creation/edit screen
      void createGenerateScreen(this.tile, this.parameters.slice(2).join(' '));
    } else {
      void createExecuteScreen(this.tile, this.parameters.slice(1).join(' '));
    }

    return;
  }
}

xit.add({
  command: ['ACT', 'ACTION'],
  name: parameters => {
    if (parameters.length === 0) {
      return 'ACTION PACKAGES';
    }
    if (parameters[1].toUpperCase() == 'GEN' || parameters[1].toUpperCase() == 'EDIT') {
      return 'EDIT ACTION PACKAGE';
    }
    return 'EXECUTE ACTION PACKAGE';
  },
  module: Execute,
});
