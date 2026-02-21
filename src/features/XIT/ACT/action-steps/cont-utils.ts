import { changeInputValue, clickElement, focusElement } from '@src/util';
import { sleep } from '@src/utils/sleep';
import { $ } from '@src/utils/select-dom';

export async function waitFor(
  condition: () => boolean,
  timeout = 5000,
  interval = 100,
): Promise<boolean> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (condition()) return true;
    await sleep(interval);
  }
  return false;
}

// AddressSelector suggestions are rendered in #autosuggest-portal outside the tile DOM.
// Only one portal can be open at a time, so we search it directly.
export async function selectLocation(container: Element, locationName: string): Promise<boolean> {
  const input = (await $(container, C.AddressSelector.input)) as HTMLInputElement | null;
  if (!input) return false;

  const portal = document.getElementById('autosuggest-portal');
  if (!portal) return false;

  focusElement(input);
  changeInputValue(input, locationName);

  const appeared = await waitFor(
    () => _$$(portal, C.AddressSelector.suggestionContent).length > 0,
    5000,
  );
  if (!appeared) return false;

  const suggestions = _$$(portal, C.AddressSelector.suggestionContent) as HTMLElement[];
  const match =
    suggestions.find(s =>
      s.textContent?.trim().toLowerCase().includes(locationName.toLowerCase()),
    ) ?? suggestions.at(0);

  if (!match) return false;

  await clickElement(match);
  return true;
}

export async function selectMaterial(container: Element, ticker: string) {
  const input = (await $(container, C.MaterialSelector.input)) as HTMLInputElement | null;
  if (!input) return false;

  const suggestionsContainer = (await $(
    container,
    C.MaterialSelector.suggestionsContainer,
  )) as HTMLElement | null;

  focusElement(input);
  changeInputValue(input, ticker);

  const suggestionsList = await $(container, C.MaterialSelector.suggestionsList);

  if (suggestionsContainer) suggestionsContainer.style.display = 'none';

  const match = _$$(suggestionsList, C.MaterialSelector.suggestionEntry).find(
    entry => _$(entry, C.ColoredIcon.label)?.textContent === ticker,
  );

  if (!match) {
    if (suggestionsContainer) suggestionsContainer.style.display = '';
    return false;
  }

  await clickElement(match as HTMLElement);
  if (suggestionsContainer) suggestionsContainer.style.display = '';
  await sleep(200);
  return true;
}
