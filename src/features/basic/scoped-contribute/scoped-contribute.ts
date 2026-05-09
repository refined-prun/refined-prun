import { clickElement } from '@src/util';

function scopeContributions(tile: PrunTile) {
  subscribe($$(tile.anchor, C.Contribution.contribute), async contributionContainer => {
    const contributeButton = contributionContainer.lastElementChild as HTMLButtonElement;
    if (contributeButton === null) {
      return;
    }
    let externalSliders: {
      slider: HTMLElement;
      restoreValue: number;
    }[] = [];
    contributeButton.addEventListener(
      'click',
      () => {
        const ownContainer = contributionContainer.parentElement as HTMLDivElement;
        if (ownContainer === null) {
          return;
        }
        externalSliders = [];
        const allSliders = _$$(contributionContainer, 'rc-slider');
        for (const slider of allSliders) {
          // Ensure that the slider is enabled and external.
          if (slider.classList.contains('rc-slider-disabled')) {
            continue;
          }
          if (ownContainer.contains(slider)) {
            continue;
          }
          // Collect information about the external slider.
          const sliderHandle = _$(slider, 'rc-slider-handle');
          if (sliderHandle === undefined) {
            continue;
          }
          const sliderValue = sliderHandle.getAttribute('aria-valuenow');
          if (sliderValue === null) {
            continue;
          }
          const restoreValue = parseFloat(sliderValue);
          // Register the external slider.
          externalSliders.push({
            slider,
            restoreValue,
          });
          // Empty the external slider.
          const mark = _$(slider, 'rc-slider-mark');
          if (mark === undefined) {
            continue;
          }
          clickElement(mark.firstElementChild as HTMLElement);
        }
      },
      { capture: true },
    );
    contributeButton.addEventListener('click', () => {
      externalSliders = [];
      for (const { slider, restoreValue } of externalSliders) {
        setSliderValue(slider, restoreValue);
      }
    });
  });
}

function setSliderValue(slider: HTMLElement, value: number) {
  const sliderHandle = _$(slider, 'rc-slider-handle');
  if (sliderHandle === undefined) {
    return;
  }
  const sliderMinText = sliderHandle.getAttribute('aria-valuemin');
  if (sliderMinText === null) {
    return;
  }
  const sliderMin = parseFloat(sliderMinText);
  const sliderMaxText = sliderHandle.getAttribute('aria-valuemax');
  if (sliderMaxText === null) {
    return;
  }
  const sliderMax = parseFloat(sliderMaxText);
  const sliderRect = slider.getBoundingClientRect();
  const valueLocalOffset = ((value - sliderMin) / (sliderMax - sliderMin)) * sliderRect.width;
  const clickEvent = new MouseEvent('click', {
    clientX: sliderRect.left + valueLocalOffset,
    clientY: sliderRect.top,
    bubbles: true,
    cancelable: true,
    view: window,
  });
  slider.dispatchEvent(clickEvent);
}

function init() {
  tiles.observe(['POPID'], scopeContributions);
}

features.add(
  import.meta.url,
  init,
  'POPID: Scopes contribute buttons to the sections they are located in.',
);
