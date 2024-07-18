import { downloadFile, clearChildren, XITWebRequest } from '../util';
import { Style } from '../Style';
import { h } from 'dom-chef';
import { $$ } from 'select-dom';
import PrunCss from '@src/prun-ui/prun-css';

export class Debug {
  private tile: HTMLElement;
  private parameters: string[];
  private pmmgSettings;
  private userInfo;
  private webData;

  public name = 'DEBUG';

  constructor(tile, parameters, pmmgSettings, userInfo, webData) {
    this.tile = tile;
    this.parameters = parameters;
    this.pmmgSettings = pmmgSettings;
    this.userInfo = userInfo;
    this.webData = webData;
  }

  create_buffer() {
    // Declare object values in static context for passing downstream
    const tile = this.tile;
    const parameters = this.parameters;
    const pmmgSettings = this.pmmgSettings;

    clearChildren(this.tile);
    const downloadButtons = document.createElement('div');
    this.tile.appendChild(downloadButtons);
    downloadButtons.appendChild(
      createDownloadButton(
        this.pmmgSettings['PMMGExtended'],
        'Download Full Settings',
        'pmmg-settings' + Date.now().toString() + '.json',
      ),
    );
    downloadButtons.appendChild(
      createDownloadButton(this.webData, 'Download All Web Data', 'pmmg-web-data' + Date.now().toString() + '.json'),
    );
    downloadButtons.appendChild(
      createDownloadButton(
        this.userInfo,
        'Download All Collected Data',
        'pmmg-user-info' + Date.now().toString() + '.json',
      ),
    );
    downloadButtons.appendChild(createDownloadPrunCssClassesButton());
    const endpointLabel = document.createElement('div');
    endpointLabel.textContent = 'Get FIO Endpoint (ex: /infrastructure/Proxion)';
    endpointLabel.style.display = 'block';
    endpointLabel.style.marginLeft = '4px';
    downloadButtons.appendChild(endpointLabel);
    const endpointInput = document.createElement('input');
    endpointInput.classList.add('input-text');
    endpointInput.style.display = 'block';
    downloadButtons.appendChild(endpointInput);
    const endpointButton = document.createElement('button');
    endpointButton.textContent = 'Download FIO Endpoint';
    endpointButton.classList.add(...Style.Button);
    endpointButton.classList.add(...Style.ButtonPrimary);
    endpointButton.style.marginLeft = '4px';
    endpointButton.style.marginBottom = '4px';
    endpointButton.style.display = 'block';
    endpointButton.addEventListener('click', function () {
      const url = 'https://rest.fnar.net' + (endpointInput.value.charAt(0) == '/' ? '' : '/') + endpointInput.value;
      XITWebRequest(
        tile,
        parameters,
        Debug_post,
        url,
        'GET',
        ['Authorization', pmmgSettings['PMMGExtended']['apikey']],
        null,
      );
    });
    downloadButtons.appendChild(endpointButton);

    return;
  }

  update_buffer() {
    // Nothing to update
  }

  destroy_buffer() {
    // Nothing constantly running so nothing to destroy
  }
}

function Debug_post(tile, parameters, jsondata) {
  try {
    console.log(JSON.parse(jsondata));
  } catch (ex) {
    /* empty */
  }
  downloadFile(jsondata, 'fio-endpoint' + Date.now().toString() + '.json', false);
  return [tile, parameters];
}

function createDownloadButton(data, buttonName, fileName) {
  const downloadButton = document.createElement('button');
  downloadButton.textContent = buttonName;
  downloadButton.classList.add(...Style.Button);
  downloadButton.classList.add(...Style.ButtonPrimary);
  downloadButton.style.marginLeft = '4px';
  downloadButton.style.marginBottom = '4px';
  downloadButton.style.display = 'block';
  downloadButton.addEventListener('click', function () {
    console.log(data);
    downloadFile(data, fileName);
  });
  return downloadButton;
}

function createDownloadPrunCssClassesButton() {
  const classes = [PrunCss.Button.btn, PrunCss.Button.primary].join(' ');
  return (
    <button
      className={classes}
      style={{
        display: 'block',
        marginLeft: '4px',
        marginBottom: '4px',
      }}
      onClick={downloadPrunCssClasses}>
      Export CSS classes
    </button>
  );
}

function downloadPrunCssClasses() {
  const classes: string[] = [];
  const styles = $$('style', document.head);
  for (const style of styles) {
    const text = style.textContent;
    if (text === null) {
      continue;
    }
    const matches = text.match(/\w+__\w+___\w+/g);
    for (const match of matches ?? []) {
      classes.push(match);
    }
  }
  classes.sort();
  const result = {};
  for (const cssClass of classes) {
    const parts = cssClass.replace('.', '').replace('___', '_').replace('__', '_').split('_');
    const parent = parts[0];
    if (parent === '') {
      continue;
    }
    const child = parts[1];
    let parentObject = result[parent];
    if (parentObject === undefined) {
      parentObject = {};
      result[parent] = parentObject;
    }
    if (parentObject[child] !== undefined) {
      continue;
    }
    parentObject[child] = cssClass.replace('.', '');
  }
  const json = JSON.stringify(result, undefined, 2);
  downloadFile(json, 'prun-css-classes.json', false);
}
