import { percent2 } from '@src/utils/format';
import { refAttributeValue } from '@src/utils/reactive-dom';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import $style from './progress-bar-tooltips.module.css';

function init() {
  subscribe($$(document, C.ProgressBar.container), progressBar => {
    const primary = _$(progressBar, C.ProgressBar.progress)!;
    const value = refAttributeValue(primary, 'value');
    const max = primary.getAttribute('max');
    progressBar.classList.add($style.progressBarTooltips);
    progressBar.setAttribute('data-tooltip-position', 'left');
    watchEffectWhileNodeAlive(progressBar, () => {
      progressBar.setAttribute('data-tooltip', percent2(Number(value.value) / Number(max)));
    });
  });

  subscribe($$(document, C.FactorBar.container), factorBar => {
    // Like fertility of planets, can be positive or negative.
    const left = _$(factorBar, C.FactorBar.left)!.children[0];
    const right = _$(factorBar, C.FactorBar.right)!.children[0];
    const valueLeft = refAttributeValue(left, 'value');
    const valueRight = refAttributeValue(right, 'value');
    factorBar.classList.add($style.progressBarTooltips);
    factorBar.setAttribute('data-tooltip-position', 'left');
    watchEffectWhileNodeAlive(factorBar, () => {
      factorBar.setAttribute(
        'data-tooltip',
        Number(valueLeft.value) === 0
          ? percent2(Number(valueRight.value))
          : percent2(-Number(valueLeft.value)),
      );
    });
  });

  subscribe($$(document, C.SliderView.container), container => {
    const handle = _$(container, 'rc-slider-handle')!;
    const value = refAttributeValue(handle, 'aria-valuenow');
    // Differentiate between sliders from 0-1 and 1-X.
    const max = handle.getAttribute('aria-valuemax');
    container.classList.add($style.progressBarTooltips);
    container.setAttribute('data-tooltip-position', 'left');
    watchEffectWhileNodeAlive(container, () => {
      container.setAttribute(
        'data-tooltip',
        max === '1' ? percent2(Number(value.value)) : percent2(Number(value.value) / Number(max)),
      );
    });
  });

  subscribe($$(document, C.OrderSlot.container), container => {
    const progress = _$(container, C.OrderSlot.progress);
    // Queued orders do not have a progress element.
    if (!progress) {
      return;
    }
    const value = refAttributeValue(progress, 'style');
    container.classList.add($style.progressBarTooltips);
    container.setAttribute('data-tooltip-position', 'right');
    watchEffectWhileNodeAlive(progress, () => {
      container.setAttribute(
        'data-tooltip',
        percent2(parseFloat(value.value?.replace(/[^0-9.]/g, '') ?? '') / 100),
      );
    });
  });
}

features.add(import.meta.url, init, 'Adds tooltips to all progress bars');
