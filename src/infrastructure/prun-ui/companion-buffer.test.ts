import { beforeEach, describe, expect, it, vi } from 'vitest';

interface ClientMessage {
  messageType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

const mocks = vi.hoisted(() => ({
  select: vi.fn(),
  selectOne: vi.fn(),
  selectAll: vi.fn(),
  click: vi.fn(),
  matchBufferSize: vi.fn<(command: string) => [number, number] | undefined>(),
  dispatchClientPrunMessage: vi.fn<(message: { messageType: string; payload: unknown }) => boolean>(
    () => true,
  ),
}));
vi.mock('@src/utils/select-dom', () => ({
  $: mocks.select,
  _$: mocks.selectOne,
  _$$: mocks.selectAll,
}));
vi.mock('@src/util', () => ({ clickElement: mocks.click, changeInputValue: vi.fn() }));
vi.mock('@src/infrastructure/prun-ui/buffer-sizes', () => ({
  matchBufferSize: mocks.matchBufferSize,
}));
vi.mock('@src/infrastructure/prun-ui/prun-css', () => ({
  C: {
    Window: { window: 'window', body: 'body' },
    Node: { node: 'node', child: 'child' },
    TileControls: { control: 'control' },
    TileFrame: { cmd: 'cmd' },
    Tile: { tile: 'tile' },
  },
}));
vi.mock('@src/infrastructure/prun-api/prun-api-listener', () => ({
  dispatchClientPrunMessage: mocks.dispatchClientPrunMessage,
}));
// The module graph reaches shell/config, which reads `document` at import time.
vi.mock('@src/infrastructure/shell/config', () => ({ default: {} }));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).document = { body: { clientWidth: 1920, clientHeight: 1080 } };

import {
  openCompanionBuffer,
  openCompanionPair,
  rememberSplitOwner,
  resizeSplitWindow,
  splitOwnerId,
} from '@src/infrastructure/prun-ui/companion-buffer';

function fakeWindow() {
  return { nodeType: 1 } as unknown as Element;
}

describe('opening companions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.matchBufferSize.mockReturnValue(undefined);
  });

  function setup(split = false, width = '600px', height = '400px') {
    const container = {
      classList: { contains: (name: string) => name === (split ? 'child' : 'body') },
      style: { width, height },
      parentElement: {},
    };
    const sibling = {};
    const controls = [{ textContent: '|' }, { textContent: '–' }];
    const windowEl = fakeWindow();
    let connected = true;
    mocks.click.mockImplementation(async () => {
      // Splitting replaces the original tile and removes its frame.
      connected = false;
    });
    const tile = {
      id: '3',
      container,
      frame: { closest: () => (connected ? windowEl : null) },
    } as unknown as PrunTile;
    mocks.select.mockResolvedValue({});
    mocks.selectAll.mockImplementation((_element, selector) =>
      selector === 'control' ? controls : [container, sibling],
    );
    mocks.selectOne.mockImplementation((element, selector) =>
      selector === 'tile' ? { getAttribute: () => (element === sibling ? '5' : '4') } : undefined,
    );
    return { tile, controls };
  }

  it.each([
    ['right', 1500, 500, 600 / 1500, 0],
    ['below', 900, 900, 400 / 900, 1],
  ] as const)(
    'sizes a companion to the %s using its command dimensions',
    async (direction, width, height, fraction, control) => {
      const { tile, controls } = setup();
      mocks.matchBufferSize.mockReturnValue([900, 500]);
      await openCompanionBuffer(tile, 'XIT STO', direction);
      expect(mocks.matchBufferSize).toHaveBeenCalledWith('XIT STO');
      expect(mocks.click).toHaveBeenCalledExactlyOnceWith(controls[control]);
      expect(mocks.dispatchClientPrunMessage.mock.calls.map(x => x[0])).toEqual([
        { messageType: 'UI_WINDOWS_UPDATE_SIZE', payload: { id: '3', size: { width, height } } },
        { messageType: 'UI_TILES_CHANGE_SIZE', payload: { id: '3', newDividerPosition: fraction } },
        { messageType: 'UI_TILES_CHANGE_COMMAND', payload: { id: '5', newCommand: 'XIT STO' } },
      ]);
    },
  );

  it('uses fallback dimensions when neither window nor command has a size', async () => {
    const { tile } = setup(false, '', '');
    await openCompanionBuffer(tile, 'UNKNOWN', 'below');
    expect(mocks.dispatchClientPrunMessage.mock.calls[0][0]).toMatchObject({
      payload: { size: { width: 600, height: 700 } },
    });
    expect(mocks.dispatchClientPrunMessage.mock.calls[1][0]).toMatchObject({
      payload: { newDividerPosition: 400 / 700 },
    });
  });

  it('only changes the sibling command when the tile is already split', async () => {
    const { tile } = setup(true);
    await openCompanionBuffer(tile, 'INV', 'below');
    expect(mocks.click).not.toHaveBeenCalled();
    expect(mocks.matchBufferSize).not.toHaveBeenCalled();
    expect(mocks.dispatchClientPrunMessage).toHaveBeenCalledExactlyOnceWith({
      messageType: 'UI_TILES_CHANGE_COMMAND',
      payload: { id: '5', newCommand: 'INV' },
    });
  });

  it('keeps command pairs side by side with their individual sizes', async () => {
    const { tile, controls } = setup();
    mocks.matchBufferSize.mockImplementation(x => (x === 'PRODCO' ? [415, 600] : [650, 300]));
    await openCompanionPair(tile, 'PRODCO', 'PRODQ');
    expect(mocks.click).toHaveBeenCalledExactlyOnceWith(controls[0]);
    expect(mocks.dispatchClientPrunMessage.mock.calls.map(x => x[0])).toEqual([
      {
        messageType: 'UI_WINDOWS_UPDATE_SIZE',
        payload: { id: '3', size: { width: 1065, height: 600 } },
      },
      { messageType: 'UI_TILES_CHANGE_SIZE', payload: { id: '3', newDividerPosition: 415 / 1065 } },
      { messageType: 'UI_TILES_CHANGE_COMMAND', payload: { id: '4', newCommand: 'PRODCO' } },
      { messageType: 'UI_TILES_CHANGE_COMMAND', payload: { id: '5', newCommand: 'PRODQ' } },
    ]);
  });
});

describe('split owner registry', () => {
  it('keeps windows separate and reports nothing for an unsplit or missing window', () => {
    const split = fakeWindow();
    rememberSplitOwner(split, '7');
    expect(splitOwnerId(fakeWindow())).toBeUndefined();
    expect(splitOwnerId(null)).toBeUndefined();
    expect(splitOwnerId(undefined)).toBeUndefined();
    expect(splitOwnerId(split)).toBe('7');
  });
});

describe('resizeSplitWindow', () => {
  it('sizes the window and then moves the divider, on the owner id', async () => {
    mocks.dispatchClientPrunMessage.mockClear();
    await resizeSplitWindow('3', 320, 520, 600);
    const calls = mocks.dispatchClientPrunMessage.mock.calls.map(c => c[0] as ClientMessage);
    expect(calls.map(m => m.messageType)).toEqual([
      'UI_WINDOWS_UPDATE_SIZE',
      'UI_TILES_CHANGE_SIZE',
    ]);
    expect(calls[0]).toMatchObject({ payload: { id: '3', size: { width: 840, height: 600 } } });
    expect(calls[1]).toMatchObject({ payload: { id: '3', newDividerPosition: 320 / 840 } });
  });
});
