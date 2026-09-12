import { changeInputValue, clickElement, focusElement, mouseOverElement } from '@src/util';
import { stationsStore } from '@src/infrastructure/prun-api/data/stations';
import { waitUntil } from '@src/utils/wait';
import { sleep } from '@src/utils/sleep';

// Suggestions render outside the tile.
// This function must be called from a user click: typing queries the server.
export async function selectAddress(container: Element, locationName: string): Promise<boolean> {
  const input = _$(container, C.AddressSelector.input) as HTMLInputElement | undefined;
  const portal = document.getElementById('autosuggest-portal');
  if (!input || !portal) {
    return false;
  }

  // Station suggestions show names, not station IDs.
  const query =
    stationsStore.getByNaturalId(locationName)?.name ??
    stationsStore.getBySystemNaturalId(locationName)?.name ??
    locationName;

  const display = portal.style.display;
  portal.style.display = 'none';
  try {
    focusElement(input);
    changeInputValue(input, query);

    // Wait for matching results; the initial list can be stale.
    // Match complete IDs before trying a substring.
    const boundary = new RegExp(
      `(^|\\W)${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\W|$)`,
      'i',
    );
    const suggestions = () => _$$(portal, C.AddressSelector.suggestionContent);
    const findBoundaryMatch = () => suggestions().find(s => boundary.test(s.textContent ?? ''));
    await waitUntil(() => !!findBoundaryMatch(), 5000);
    const match =
      findBoundaryMatch() ??
      suggestions().find(s => s.textContent?.trim().toLowerCase().includes(query.toLowerCase()));
    if (!match) {
      return false;
    }

    // Let react-autosuggest update the highlighted suggestion before clicking.
    mouseOverElement(portal, match);
    await sleep(0);
    await clickElement(match);
    return true;
  } finally {
    portal.style.display = display;
  }
}
