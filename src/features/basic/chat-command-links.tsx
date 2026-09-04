import PrunLink from '@src/components/PrunLink.vue';
import { companyStore } from '@src/infrastructure/prun-api/data/company';

interface CommandMatch {
  command: string;
  display: string;
  end: number;
  start: number;
}

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.Message.text), message => {
    const matches = findCommands(message.textContent ?? '');
    for (let i = matches.length - 1; i >= 0; i--) {
      replaceCommand(message, matches[i]);
    }
  });
}

function findCommands(text: string) {
  const matches: CommandMatch[] = [];
  for (const match of text.matchAll(/`([^`\r\n]+)`/g)) {
    const display = match[1].trim();
    if (!display) {
      continue;
    }
    const start = match.index!;
    const sanitizedCommand =
      display.toUpperCase() === 'COLIQ' ? `CO ${companyStore.value!.code}` : display;
    matches.push({
      command: sanitizedCommand,
      display,
      start,
      end: start + match[0].length,
    });
  }
  return matches;
}

function replaceCommand(message: HTMLElement, match: CommandMatch) {
  const start = findTextBoundary(message, match.start);
  const end = findTextBoundary(message, match.end);
  if (!start || !end) {
    return;
  }

  const range = document.createRange();
  range.setStart(...start);
  range.setEnd(...end);
  range.deleteContents();

  const marker = document.createTextNode('');
  range.insertNode(marker);
  createFragmentApp(() => (
    <PrunLink inline command={match.command}>
      {match.display}
    </PrunLink>
  )).before(marker);
  marker.remove();
}

function findTextBoundary(element: HTMLElement, offset: number): [Text, number] | undefined {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode() as Text | null;
  while (node) {
    if (offset <= node.length) {
      return [node, offset];
    }
    offset -= node.length;
    node = walker.nextNode() as Text | null;
  }
  return undefined;
}

function init() {
  tiles.observe(['COMG', 'COMP', 'COMU'], onTileReady);
}

features.add(import.meta.url, init, 'Renders text in backticks as command links.');
