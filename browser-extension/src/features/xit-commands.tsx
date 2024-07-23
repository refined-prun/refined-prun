import { XITClasses } from '@src/XIT';
import features from '@src/feature-registry';
import buffers from '@src/prun-ui/prun-buffers';
import { dot } from '@src/utils/dot';
import { $ } from 'select-dom';
import PrunCss from '@src/prun-ui/prun-css';
import { h } from 'dom-chef';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let xitArgs: any;

export function applyXITParameters(pmmgSettings, userInfo, webData, modules) {
  xitArgs = {
    userInfo,
    webData,
    modules,
    pmmgSettings,
  };
}

function onBufferCreated(buffer: PrunBuffer) {
  const frame = buffer.frame;
  const tile = $(dot(PrunCss.ScrollView.view), frame)?.children[0];
  if (!tile) {
    return;
  }

  const rawParameter = buffer.parameter;
  if (!rawParameter) {
    return;
  }

  let parameters = [] as string[];
  if (rawParameter[0] === '1') {
    const keyValues = rawParameter.split(' ');
    parameters.push(...keyValues.map(x => x.slice(2)));
  } else {
    parameters = rawParameter.split(/[_ ]+/g);
  }
  if (parameters.length === 0) {
    return;
  }

  const command = parameters[0];
  if (command.toUpperCase() == 'FIO') {
    // Exception for FIO to use XIT
    return;
  }

  tile.classList.add('xit-tile');
  if (tile.firstChild) {
    (tile.firstChild as HTMLElement).style.backgroundColor = '#222222';
  }

  const xitClass = XITClasses[command.toUpperCase()];
  if (!xitClass) {
    tile.textContent = 'Error! No Matching Function!';
    return;
  }

  const contentDiv = <div style={{ height: '100%', flexGrow: 1 }} />;
  tile.appendChild(contentDiv);

  const xitObject = new xitClass(
    contentDiv,
    parameters,
    xitArgs.pmmgSettings,
    xitArgs.userInfo,
    xitArgs.webData,
    xitArgs.modules,
  );
  $(dot(PrunCss.TileFrame.title), frame)!.textContent = xitObject.name;
  xitObject.create_buffer();

  const header = frame.children[3] || frame.children[2];
  const className = 'prun-xit-refresh';
  for (const element of Array.from(header.getElementsByClassName(className))) {
    element.remove();
  }
  const refreshButton = (
    <div
      className={className + ' button-upper-right'}
      style={{
        fontSize: __CHROME__ ? '16px' : '18px',
        paddingTop: __CHROME__ ? '12px' : '7px',
      }}
      onClick={() => xitObject.create_buffer()}>
      ⟳
    </div>
  );
  header.insertBefore(refreshButton, header.firstChild);
}

export function init() {
  buffers.observe('XIT', onBufferCreated);
}

void features.add({
  id: 'xit-commands',
  init,
});
