import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { UI_TILES_CHANGE_COMMAND } from '@src/infrastructure/prun-api/client-messages';
import { dispatchClientPrunMessage } from '@src/infrastructure/prun-api/prun-api-listener';
import { changeInputValue, clickElement } from '@src/util';
import { sleep } from '@src/utils/sleep';

export class TileModifier {
  private tile?: HTMLElement;

  constructor(tile: PrunTile) {
    this.tile = getAncestorByClassName(tile.frame, C.Tile.tile);
  }

  async changeCommand(command: string, submit: boolean = true) {
    if (this.tile) {
      changeTileCommand(this.tile, command, submit);
      return true;
    }
    return false;
  }
}

async function changeTileCommand(tile: HTMLElement, command: string, submit: boolean) {
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
    if (submit) {
      input.form!.requestSubmit();
    }
  }
  await $(tile, C.TileFrame.frame);
}

function getAncestorByClassName(el: HTMLElement, className: string): HTMLElement | undefined {
  let e: HTMLElement | null = el;
  while (e) {
    if (e.classList.contains(className)) return e;
    e = e.parentElement;
  }

  return undefined;
}
