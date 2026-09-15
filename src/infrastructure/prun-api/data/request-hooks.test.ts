import { describe, expect, it, vi } from 'vitest';
import { createRequestStore } from '@src/infrastructure/prun-api/data/request-hooks';

describe('createRequestStore passive access', () => {
  it('requests through wrapped properties but never through peek', () => {
    const request = vi.fn();
    const source = { value: { current: 1 } };
    const wrapped = createRequestStore(request, source);

    expect(wrapped.peek()).toBe(source);
    expect(wrapped.peek().value).toEqual({ current: 1 });
    expect(request).not.toHaveBeenCalled();

    expect(wrapped.value).toEqual({ current: 1 });
    expect(request).toHaveBeenCalledOnce();
  });
});
