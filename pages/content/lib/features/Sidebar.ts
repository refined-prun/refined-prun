import { Module } from '../ModuleRunner';
import { Selector } from '../Selector';
import { Style } from '../Style';
import { genericCleanup, showBuffer, createTextSpan } from '../util';

export class Sidebar implements Module {
  private tag = 'pb-sidebar';
  private buttons;
  private defaultButtons = ['BS', 'CONT', 'COM', 'CORP', 'CXL', 'FIN', 'FLT', 'INV', 'MAP', 'PROD', 'LEAD', 'CMDS'];

  constructor(buttons) {
    this.buttons = buttons;
  }

  cleanup(full: boolean = false) {
    full && genericCleanup(this.tag);
  }

  run() {
    const sidebar = document.getElementById(Selector.LeftSidebar);

    if (!this.buttons) {
      this.buttons = [
        ['BS', 'BS'],
        ['CONT', 'CONTS'],
        ['COM', 'COM'],
        ['CORP', 'CORP'],
        ['CXL', 'CXL'],
        ['FIN', 'FIN'],
        ['FLT', 'FLT'],
        ['INV', 'INV'],
        ['MAP', 'MAP'],
        ['PROD', 'PROD'],
        ['LEAD', 'LEAD'],
        ['CMDS', 'CMDS'],
        ['SET', 'XIT SETTINGS'],
        ['HELP', 'XIT HELP'],
      ];
    }
    if (!sidebar) {
      return;
    }

    this.defaultButtons.forEach(defaultButton => {
      let enabled = false;
      for (const option of this.buttons) {
        if (option[0].toUpperCase() === defaultButton) {
          enabled = true;
          break;
        }
      }
      if (!enabled) {
        (Array.from(sidebar.children) as HTMLElement[]).forEach(child => {
          if (child.firstChild != null && (child.firstChild.textContent || '').toUpperCase() === defaultButton) {
            child.classList.add('hidden-element');
            (Array.from(child.children) as HTMLElement[]).forEach(childChild => {
              childChild.classList.add('hidden-element');
            });
          }
        });
      }
    });
    if ((sidebar.children[sidebar.children.length - 1] as HTMLElement).classList.contains(this.tag)) {
      //console.log(sidebar.children[sidebar.children.length-1])
      return;
    }
    this.buttons.forEach(buttonInfo => {
      if (this.defaultButtons.includes(buttonInfo[0].toUpperCase())) {
        return;
      }
      const button = document.createElement('div');
      const buttonText = createTextSpan(buttonInfo[0].toUpperCase(), this.tag);
      const sliver = document.createElement('div');
      button.classList.add(this.tag);
      sliver.classList.add(this.tag);
      button.classList.add(...Style.SidebarButton);
      buttonText.classList.add(...Style.SidebarText);
      sliver.classList.add(...Style.SidebarSliver);
      button.appendChild(buttonText);
      button.appendChild(sliver);
      sidebar.appendChild(button);
      button.addEventListener('click', function () {
        showBuffer(buttonInfo[1]);
      });
    });
  }
}
