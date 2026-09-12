import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { waitActionFeedback } from './action-feedback';

const mocks = vi.hoisted(() => ({
  select: vi.fn(),
  disconnected: vi.fn(),
  click: vi.fn(),
}));

vi.mock('@src/utils/select-dom', () => ({
  $: mocks.select,
  _$: vi.fn(),
  _$$: vi.fn(() => []),
}));
vi.mock('@src/utils/on-node-disconnected', () => ({
  waitNodeDisconnected: mocks.disconnected,
}));
vi.mock('@src/util', () => ({ clickElement: mocks.click }));
vi.mock('@src/infrastructure/prun-ui/prun-css', () => ({
  C: {
    ActionFeedback: { overlay: 'overlay', success: 'success', error: 'error' },
    ActionConfirmationOverlay: { container: 'confirmation' },
  },
}));

function pending<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => (resolve = done));
  return { promise, resolve };
}

function element(classes: string[] = []) {
  return {
    isConnected: true,
    classList: { contains: (name: string) => classes.includes(name) },
  } as Element;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  mocks.select.mockImplementation(() => pending<Element>().promise);
  mocks.disconnected.mockImplementation(() => pending<void>().promise);
});

afterEach(() => vi.useRealTimers());

describe('action feedback lifecycle', () => {
  it('dismisses success and clears the timeout', async () => {
    const success = element(['success']);
    mocks.select.mockImplementation((_frame, selector) =>
      selector === 'overlay' || selector === 'success'
        ? Promise.resolve(success)
        : pending<Element>().promise,
    );
    mocks.disconnected.mockImplementation(node =>
      node === success ? Promise.resolve() : pending<void>().promise,
    );
    const result = await waitActionFeedback(element(), {
      timeoutMs: 30_000,
      dismissSuccess: true,
    });
    expect(result.result).toBe('success');
    expect(mocks.click).toHaveBeenCalledExactlyOnceWith(success);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cancels when the tile closes during progress', async () => {
    const closed = pending<void>();
    mocks.disconnected.mockReturnValue(closed.promise);
    mocks.select.mockImplementation((_frame, selector) =>
      selector === 'overlay' ? Promise.resolve(element()) : pending<Element>().promise,
    );
    const result = waitActionFeedback(element(), { timeoutMs: 30_000 });
    await vi.advanceTimersByTimeAsync(0);
    closed.resolve();
    expect(await result).toMatchObject({ result: 'cancel' });
    expect(mocks.click).not.toHaveBeenCalled();
  });

  it('cancels when the tile closes before feedback appears', async () => {
    const closed = pending<void>();
    mocks.disconnected.mockReturnValue(closed.promise);
    const frame = element();
    const result = waitActionFeedback(frame, { timeoutMs: 30_000 });
    closed.resolve();
    expect(await result).toMatchObject({ result: 'cancel' });
    expect(mocks.click).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('times out when the initial feedback overlay never appears', async () => {
    const result = waitActionFeedback(element(), { timeoutMs: 30_000 });
    await vi.advanceTimersByTimeAsync(30_000);
    expect(await result).toMatchObject({
      result: 'error',
      message: 'Timed out waiting for action feedback',
    });
    expect(mocks.click).not.toHaveBeenCalled();
  });

  it('does not dismiss a late success after the feedback timeout', async () => {
    const success = pending<Element>();
    mocks.select.mockImplementation((_frame, selector) => {
      if (selector === 'overlay') {
        return Promise.resolve(element());
      }
      if (selector === 'success') {
        return success.promise;
      }
      return pending<Element>().promise;
    });
    const result = waitActionFeedback(element(), { timeoutMs: 30_000, dismissSuccess: true });
    await vi.advanceTimersByTimeAsync(30_000);
    expect(await result).toMatchObject({ result: 'error' });
    success.resolve(element(['success']));
    await Promise.resolve();
    expect(mocks.click).not.toHaveBeenCalled();
  });
});
