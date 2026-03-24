import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { UI_TILES_CHANGE_COMMAND } from '@src/infrastructure/prun-api/client-messages';
import { dispatchClientPrunMessage } from '@src/infrastructure/prun-api/prun-api-listener';
import { changeInputValue, clickElement } from '@src/util';
import { sleep } from '@src/utils/sleep';
import { setBufferSize, showBuffer } from '@src/infrastructure/prun-ui/buffers';

interface TileAllocatorOptions {
  tile: PrunTile;
  onBufferSplit: () => void;
}

export class TileAllocator {
  private allocatedTile?: HTMLElement;

  constructor(options: TileAllocatorOptions) {
    const { tile } = options;
    const isSoloBuffer = tile.container.classList.contains(C.Window.body);
    if (isSoloBuffer) {
      options.onBufferSplit();
      splitBuffer(tile);
    } else {
      this.allocatedTile = getCompanionTile(tile);
    }
  }

  async requestTile(command: string) {
    if (this.allocatedTile?.isConnected) {
      await changeTileCommand(this.allocatedTile, command);
    } else {
      this.allocatedTile = await requestTile(command);
    }
    return tiles.findByContainer(this.allocatedTile?.parentElement)[0];
  }
}

function getCompanionTile(tile: PrunTile) {
  const isInNodeChild = tile.container.classList.contains(C.Node.child);
  const isInNode = tile.container.parentElement?.classList.contains(C.Node.node);
  const isInWindow = tile.container.parentElement?.parentElement?.classList.contains(C.Window.body);
  if (!isInNodeChild || !isInNode || !isInWindow) {
    return undefined;
  }

  const node = tile.container.parentElement!;
  const sibling = _$$(node, C.Node.child).find(x => x !== tile.container)!;
  return _$(sibling, C.Tile.tile);
}

async function changeTileCommand(tile: HTMLElement, command: string) {
  const id = getPrunId(tile)!;
  let message = UI_TILES_CHANGE_COMMAND(id, null);
  if (!dispatchClientPrunMessage(message)) {
    const changeButton = _$$(tile, C.TileControls.control).find(x => x.textContent === ':');
    await clickElement(changeButton);
  } else {
    await sleep(0);
  }
  message = UI_TILES_CHANGE_COMMAND(id, command);
  if (!dispatchClientPrunMessage(message)) {
    const input = (await $(tile, C.PanelSelector.input)) as HTMLInputElement;
    changeInputValue(input, command);
    input.form!.requestSubmit();
  }
  await $(tile, C.TileFrame.frame);
}

async function requestTile(command: string) {
  const window = await showBuffer(command, { autoSubmit: true });
  await sleep(0);
  const body = _$(window, C.Window.body);
  return body ? _$(body, C.Tile.tile) : undefined;
}

function splitBuffer(tile: PrunTile) {
  const width = parseInt(tile.container.style.width.replace('px', ''), 10);
  const height = parseInt(tile.container.style.height.replace('px', ''), 10);
  setBufferSize(tile.id, width + 450, height);
  const changeButton = _$$(tile.frame, C.TileControls.control).find(x => x.textContent === '|');
  void clickElement(changeButton);
}
