import { beforeEach, describe, expect, it, vi } from 'vitest';
import { userData } from '@src/store/user-data';
import {
  bundledChangelog,
  getLatestRelease,
  hasUnseenChangelog,
  latestReleasedVersion,
  markChangelogSeen,
  parseChangelog,
} from './changelog-data';

vi.mock('@src/store/user-data', () => ({
  userData: { lastSeenChangelogVersion: undefined },
}));

vi.mock('../../../../CHANGELOG.md?raw', () => ({
  default:
    '# Changelog\n## Unreleased\n### Added\n- Draft\n## 26.9.16\n### Fixed\n## 26.9.15\n### Fixed\n- Fix\n## 26.9.14\n### Added\n- Feature',
}));

beforeEach(() => {
  userData.lastSeenChangelogVersion = undefined;
});

describe('shared changelog data', () => {
  it('keeps unreleased sections, command markup, and continuation lines', () => {
    const releases = parseChangelog(
      '# Changelog\r\n## Unreleased\r\n### New commands\r\n- `XIT TEST`: First line\r\n  second line\r\n\r\n## 26.9.15\r\n### Fixed\r\n- Last item',
    );
    expect(releases).toEqual([
      {
        version: 'Unreleased',
        sections: [{ category: 'New commands', items: ['`XIT TEST`: First line second line'] }],
      },
      { version: '26.9.15', sections: [{ category: 'Fixed', items: ['Last item'] }] },
    ]);
  });

  it('keeps unreleased notes and empty releases out of the notification version', () => {
    expect(getLatestRelease(bundledChangelog)?.version).toBe('26.9.15');
    expect(latestReleasedVersion).toBe('26.9.15');
  });

  it('uses the existing saved version for unmigrated data', () => {
    expect(hasUnseenChangelog(undefined)).toBe(true);
    expect(hasUnseenChangelog('26.9.14')).toBe(true);
    markChangelogSeen();
    expect(userData.lastSeenChangelogVersion).toBe('26.9.15');
    expect(hasUnseenChangelog(userData.lastSeenChangelogVersion)).toBe(false);
  });

  it('returns no releases for an invalid changelog', () => {
    expect(parseChangelog('Not found')).toEqual([]);
  });
});
