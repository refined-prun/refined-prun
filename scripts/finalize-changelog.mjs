// Renames CHANGELOG.md's "## Unreleased" section to a version heading and opens a fresh
// empty "## Unreleased" section above it. No-op if Unreleased has no content.

import { readFileSync, writeFileSync } from 'fs';

const version = process.argv[2];
if (!version) {
  console.error('Usage: node scripts/finalize-changelog.mjs <version>');
  process.exit(1);
}

const lines = readFileSync('CHANGELOG.md', 'utf8').split('\n');

const unreleasedIndex = lines.findIndex(line => line === '## Unreleased');
if (unreleasedIndex === -1) {
  console.error('CHANGELOG.md has no "## Unreleased" heading.');
  process.exit(1);
}

let nextHeadingIndex = lines.findIndex((line, i) => i > unreleasedIndex && line.startsWith('## '));
if (nextHeadingIndex === -1) {
  nextHeadingIndex = lines.length;
}

const content = lines.slice(unreleasedIndex + 1, nextHeadingIndex);
if (!content.some(line => line.trim() !== '')) {
  console.log('Unreleased section is empty, nothing to finalize.');
  process.exit(0);
}

const newLines = [
  ...lines.slice(0, unreleasedIndex),
  '## Unreleased',
  '',
  `## ${version}`,
  ...lines.slice(unreleasedIndex + 1),
];

writeFileSync('CHANGELOG.md', newLines.join('\n'));
console.log(`Cut Unreleased into ## ${version}.`);
