import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { setBufferSize, showBuffer } from '@src/infrastructure/prun-ui/buffers';
import {
  getLocationLineFromAddress,
  isPlanetLine,
} from '@src/infrastructure/prun-api/data/addresses';
import { clickElement, changeInputValue } from '@src/util';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { UI_TILES_CHANGE_COMMAND } from '@src/infrastructure/prun-api/client-messages';
import { dispatchClientPrunMessage } from '@src/infrastructure/prun-api/prun-api-listener';

async function onTileReady(tile: PrunTile) {
  const ship = computed(() => shipsStore.getByRegistration(tile.parameter));

  const planetNaturalId = computed(() => {
    const s = ship.value;
    if (!s || s.flightId !== null) {
      return undefined;
    }
    const location = getLocationLineFromAddress(s.address ?? undefined);
    if (!isPlanetLine(location)) {
      return undefined;
    }
    return location.entity.naturalId;
  });

  const baseStore = computed(() => {
    const id = planetNaturalId.value;
    if (!id) {
      return undefined;
    }
    const site = sitesStore.getByPlanetNaturalId(id);
    return storagesStore.all.value?.find(x => x.addressableId === site?.siteId);
  });

  const contextBar = await $(tile.frame, C.ContextControls.container);

  createFragmentApp(() => {
    const store = baseStore.value;
    const id = planetNaturalId.value;
    if (!store || !id) {
      return null;
    }
    return (
      <div
        class={[C.ContextControls.item, C.fonts.fontRegular, C.type.typeSmall]}
        onClick={(e: MouseEvent) => {
          const cmd = `INV ${store.id.substring(0, 8)}`;
          if (e.shiftKey) {
            void openCompanionBuffer(tile, cmd);
          } else {
            showBuffer(cmd);
          }
        }}>
        <span>
          <span class={C.ContextControls.cmd}>INV {id}</span>
        </span>
      </div>
    );
  }).prependTo(contextBar);
}

async function openCompanionBuffer(tile: PrunTile, command: string) {
  const windowEl = tile.frame.closest(`.${C.Window.window}`) as HTMLElement | null;

  if (tile.container.classList.contains(C.Window.body)) {
    const parsedW = parseInt(tile.container.style.width, 10);
    const parsedH = parseInt(tile.container.style.height, 10);
    const w = Number.isNaN(parsedW) ? 600 : parsedW;
    const h = Number.isNaN(parsedH) ? 400 : parsedH;
    setBufferSize(tile.id, w + 450, h);

    const splitButton = _$$(tile.frame, C.TileControls.control).find(x => x.textContent === '|');
    await clickElement(splitButton);

    if (!windowEl) {
      return;
    }

    const node = await $(windowEl, C.Node.node);
    const companion = _$$(node, C.Node.child)[1] as HTMLElement | undefined;
    if (companion) {
      await setChildCommand(companion, command);
    }
  } else if (tile.container.classList.contains(C.Node.child)) {
    const node = tile.container.parentElement!;
    const sibling = _$$(node, C.Node.child).find(x => x !== tile.container);
    if (sibling) {
      await setChildCommand(sibling, command);
    }
  }
}

async function setChildCommand(child: Element, command: string) {
  const tileEl = _$(child, C.Tile.tile) as HTMLElement | null;
  if (!tileEl) {
    return;
  }

  const id = getPrunId(tileEl)!;
  const message = UI_TILES_CHANGE_COMMAND(id, command);
  if (!dispatchClientPrunMessage(message)) {
    const input = (await $(child, C.PanelSelector.input)) as HTMLInputElement;
    changeInputValue(input, command);
    input.form!.requestSubmit();
  }
}

function init() {
  tiles.observe('SHPI', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'SHPI: Adds a Base Inv button when the ship is landed at a planet with a player base.',
);
