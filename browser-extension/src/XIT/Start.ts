import { createTextSpan, clearChildren, createLink } from '../util';

export class Start {
  private tile: HTMLElement;
  public name = 'PMMG INTRODUCTION';

  constructor(tile) {
    this.tile = tile;
  }

  create_buffer() {
    clearChildren(this.tile);
    this.tile.style.fontSize = '12px';
    this.tile.style.paddingLeft = '2px';
    const welcome = createTextSpan('Thank you for using PMMG Extended!');
    welcome.classList.add('title');
    welcome.style.paddingLeft = '0';
    this.tile.appendChild(welcome);
    this.tile.appendChild(createTextSpan('This is a short tutorial on how to get the most out of the extension.'));
    const websiteLinkDiv = document.createElement('div');
    websiteLinkDiv.style.paddingTop = '15px';
    this.tile.appendChild(websiteLinkDiv);
    websiteLinkDiv.appendChild(createTextSpan('Details on what PMMG offers can be found here: '));
    const websiteLink = document.createElement('a');
    websiteLink.href = 'https://sites.google.com/view/pmmgextended/home?authuser=0';
    websiteLink.target = '_blank';
    websiteLink.style.display = 'inline-block';
    websiteLink.classList.add('link');
    websiteLink.textContent = 'PMMG Extended';
    websiteLinkDiv.appendChild(websiteLink);

    const helpDiv = document.createElement('div');
    this.tile.appendChild(helpDiv);
    helpDiv.style.paddingTop = '15px';
    helpDiv.appendChild(createTextSpan('You can find a list of all of the PMMG commands using '));
    const helpLink = createLink('XIT HELP', 'XIT HELP');
    helpLink.style.display = 'inline-block';
    helpDiv.appendChild(helpLink);

    const settingsDiv = document.createElement('div');
    this.tile.appendChild(settingsDiv);
    settingsDiv.style.paddingTop = '15px';
    settingsDiv.appendChild(createTextSpan("PMMG's settings can be accessed using "));
    const settingsLink = createLink('XIT SETTINGS', 'XIT SETTINGS');
    settingsLink.style.display = 'inline-block';
    settingsDiv.appendChild(settingsLink);

    const scanDiv = document.createElement('div');
    this.tile.appendChild(scanDiv);
    scanDiv.style.paddingTop = '15px';
    scanDiv.appendChild(
      createTextSpan(
        "To get PMMG to show you data about your space empire, you need to 'scan in' your bases by refreshing the page, then opening each of your production lines. You can check how much data has been scanned in using the XIT HEALTH buffer.",
      ),
    );

    const finDiv = document.createElement('div');
    this.tile.appendChild(finDiv);
    finDiv.style.paddingTop = '15px';
    finDiv.appendChild(
      createTextSpan(
        'Once you have scanned in your data, one of the biggest PMMG features is in the XIT FIN buffer. It tracks your finances more accurately than the in game FIN buffer.',
      ),
    );

    const conclusionDiv = document.createElement('div');
    this.tile.appendChild(conclusionDiv);
    conclusionDiv.style.paddingTop = '15px';
    conclusionDiv.appendChild(createTextSpan('Contact PiBoy314 in game or on Discord if you have questions.'));
    return;
  }

  update_buffer() {
    // Nothing to update
  }

  destroy_buffer() {
    // Nothing constantly running so nothing to destroy
  }
}
