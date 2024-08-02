import { XITClasses } from '@src/XIT';
import features from '@src/feature-registry';
import buffers from '@src/prun-ui/prun-buffers';
import PrunCss from '@src/prun-ui/prun-css';
import { h } from 'dom-chef';
import descendantPresent from '@src/utils/descendant-present';
import { _$, _$$ } from '@src/utils/get-element-by-class-name';

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

async function onBufferCreated(buffer: PrunBuffer) {
  const frame = buffer.frame;
  const scrollView = await descendantPresent(frame, PrunCss.ScrollView.view);
  const body = scrollView.children[0] as HTMLDivElement;
  if (!body) {
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

  body.classList.add('xit-tile');
  // Green screen
  body.style.background = '';
  if (body.firstChild) {
    (body.firstChild as HTMLElement).style.backgroundColor = '#222222';
  }

  const xitClass = XITClasses[command.toUpperCase()];
  if (!xitClass) {
    body.textContent = 'Error! No Matching Function!';
    return;
  }

  const contentDiv = <div style={{ height: '100%', flexGrow: 1 }} />;
  body.appendChild(contentDiv);

  const xitObject = new xitClass(
    contentDiv,
    parameters,
    xitArgs.pmmgSettings,
    xitArgs.userInfo,
    xitArgs.webData,
    xitArgs.modules,
  );
  _$(PrunCss.TileFrame.title, frame)!.textContent = xitObject.name;
  xitObject.create_buffer();

  const header = frame.children[3] || frame.children[2];
  const className = 'prun-xit-refresh';
  for (const element of _$$(className, header)) {
    element.remove();
  }
  const refreshButton = (
    <div
      className={`${className} button-upper-right`}
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
