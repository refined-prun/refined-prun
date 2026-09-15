import changelogRaw from '../../../../CHANGELOG.md?raw';
import { userData } from '@src/store/user-data';

export interface ChangelogSection {
  category: string;
  items: string[];
}

export interface ChangelogRelease {
  version: string;
  sections: ChangelogSection[];
}

export function parseChangelog(text: string) {
  const releases: ChangelogRelease[] = [];
  let release: ChangelogRelease | undefined;
  let section: ChangelogSection | undefined;

  for (const line of text.split(/\r?\n/)) {
    const versionHeading = /^## (.+)$/.exec(line);
    if (versionHeading) {
      release = { version: versionHeading[1].trim(), sections: [] };
      releases.push(release);
      section = undefined;
      continue;
    }
    if (!release) {
      continue;
    }
    const categoryHeading = /^### (.+)$/.exec(line);
    if (categoryHeading) {
      section = { category: categoryHeading[1].trim(), items: [] };
      release.sections.push(section);
      continue;
    }
    if (section === undefined) {
      continue;
    }
    const item = /^- (.+)$/.exec(line);
    if (item) {
      section.items.push(item[1].trim());
      continue;
    }
    if (/^\s+\S/.test(line) && section.items.length > 0) {
      section.items[section.items.length - 1] += ` ${line.trim()}`;
    }
  }

  return releases;
}

export const bundledChangelog = parseChangelog(changelogRaw);

export function getLatestRelease(releases: readonly ChangelogRelease[]) {
  return releases.find(x => x.version !== 'Unreleased' && x.sections.some(x => x.items.length > 0));
}

export const latestReleasedVersion = getLatestRelease(bundledChangelog)?.version;

export function hasUnseenChangelog(lastSeenVersion: string | undefined): boolean {
  return latestReleasedVersion !== undefined && lastSeenVersion !== latestReleasedVersion;
}

export function markChangelogSeen() {
  if (latestReleasedVersion === undefined) {
    return;
  }
  userData.lastSeenChangelogVersion = latestReleasedVersion;
}
