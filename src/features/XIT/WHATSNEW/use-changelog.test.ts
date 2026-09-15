import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userData } from '@src/store/user-data';
import { useChangelog } from './use-changelog';

vi.mock('@src/store/user-data', () => ({
  userData: { lastSeenChangelogVersion: undefined },
}));

vi.mock('../../../../CHANGELOG.md?raw', () => ({
  default:
    '# Changelog\n## Unreleased\n### Added\n- Bundled draft\n## 26.9.15\n### Fixed\n- Bundled fix',
}));

const remoteChangelog =
  '# Changelog\n## Unreleased\n### Added\n- Remote draft\n## 26.9.16\n### Fixed\n- Remote fix';

beforeEach(() => {
  userData.lastSeenChangelogVersion = undefined;
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('WHATSNEW loading', () => {
  it('shows bundled releases while fetching, then lets the user show remote drafts', async () => {
    const response = Promise.withResolvers<Response>();
    const fetch = vi.fn(() => response.promise);
    vi.stubGlobal('fetch', fetch);

    const state = useChangelog('26.9.15');
    expect(fetch).toHaveBeenCalledOnce();
    expect(state.loading.value).toBe(true);
    expect(state.canShowUnreleased.value).toBe(false);
    expect(state.changelog.value.map(x => x.version)).toEqual(['26.9.15']);
    expect(userData.lastSeenChangelogVersion).toBe('26.9.15');

    response.resolve(new Response(remoteChangelog));
    await vi.waitFor(() => expect(state.loading.value).toBe(false));
    expect(state.failed.value).toBe(false);
    expect(state.isLatestVersion.value).toBe(false);
    expect(state.canShowUnreleased.value).toBe(true);
    expect(state.showUnreleased.value).toBe(false);
    expect(state.changelog.value.map(x => x.version)).toEqual(['26.9.16']);
    state.showUnreleased.value = true;
    expect(state.changelog.value.map(x => x.version)).toEqual(['Unreleased', '26.9.16']);
    expect(state.changelog.value[0].sections[0].items).toEqual(['Remote draft']);
    state.showUnreleased.value = false;
    expect(state.changelog.value.map(x => x.version)).toEqual(['26.9.16']);
    // Remote versions must not change the bundled startup notification baseline.
    expect(userData.lastSeenChangelogVersion).toBe('26.9.15');
  });

  it('treats version 0.0.0 as latest before and after loading newer notes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(remoteChangelog)));
    const state = useChangelog('0.0.0');
    expect(state.isLatestVersion.value).toBe(true);
    expect(state.currentVersion.value).toBe('26.9.15');
    await vi.waitFor(() => expect(state.loading.value).toBe(false));
    expect(state.isLatestVersion.value).toBe(true);
    expect(state.currentVersion.value).toBe('26.9.16');
  });

  it.each(['network', 'http', 'invalid'])(
    'keeps bundled notes after a %s error and supports retry',
    async failure => {
      const fetch = vi.fn();
      if (failure === 'network') {
        fetch.mockRejectedValueOnce(new Error('Offline'));
      } else {
        fetch.mockResolvedValueOnce(
          new Response('Not found', { status: failure === 'http' ? 503 : 200 }),
        );
      }
      vi.stubGlobal('fetch', fetch);
      const state = useChangelog('26.9.15');
      await vi.waitFor(() => expect(state.loading.value).toBe(false));
      expect(state.failed.value).toBe(true);
      expect(state.changelog.value.map(x => x.version)).toEqual(['26.9.15']);
      expect(state.canShowUnreleased.value).toBe(true);

      fetch.mockResolvedValueOnce(new Response(remoteChangelog));
      const pending = state.fetchData();
      expect(state.loading.value).toBe(true);
      expect(state.failed.value).toBe(false);
      expect(state.canShowUnreleased.value).toBe(false);
      await pending;
      expect(state.loading.value).toBe(false);
      expect(state.failed.value).toBe(false);
      expect(state.changelog.value.map(x => x.version)).toEqual(['26.9.16']);
    },
  );

  it('starts a new request and resets draft visibility for each open', async () => {
    const fetch = vi.fn(() => Promise.resolve(new Response(remoteChangelog)));
    vi.stubGlobal('fetch', fetch);
    const first = useChangelog('26.9.15');
    await vi.waitFor(() => expect(first.loading.value).toBe(false));
    first.showUnreleased.value = true;
    const second = useChangelog('26.9.15');
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(second.loading.value).toBe(true);
    expect(second.showUnreleased.value).toBe(false);
    expect(second.canShowUnreleased.value).toBe(false);
    expect(second.changelog.value.map(x => x.version)).toEqual(['26.9.15']);
    await vi.waitFor(() => expect(second.loading.value).toBe(false));
  });

  it('does not offer an Unreleased control when there are no draft notes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('## Unreleased\n## 26.9.15\n### Fixed\n- Fix')),
    );
    const state = useChangelog('26.9.15');
    await vi.waitFor(() => expect(state.loading.value).toBe(false));
    expect(state.canShowUnreleased.value).toBe(false);
    expect(state.isLatestVersion.value).toBe(true);
  });

  it('ignores empty release categories when checking the latest remote version', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(new Response('## 26.9.16\n### Fixed\n## 26.9.15\n### Fixed\n- Fix')),
    );
    const state = useChangelog('26.9.15');
    await vi.waitFor(() => expect(state.loading.value).toBe(false));
    expect(state.failed.value).toBe(false);
    expect(state.latestVersion.value?.version).toBe('26.9.15');
    expect(state.isLatestVersion.value).toBe(true);
  });
});
