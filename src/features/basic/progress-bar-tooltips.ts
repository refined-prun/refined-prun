import { percent2 } from '@src/utils/format';
import { refAttributeValue } from '@src/utils/reactive-dom';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

function init() {
  subscribe($$(document, C.ProgressBar.container), progressBar => {
    // FLT has primary bar and secondary bar.
    const primary = _$(progressBar, C.ProgressBar.progress)!;
    const value = refAttributeValue(primary, 'value');
    const max = primary.getAttribute('max');
    watchEffectWhileNodeAlive(progressBar, () => {
      progressBar.title = percent2(Number(value.value) / Number(max));
    });
  });

  subscribe($$(document, C.FactorBar.container), factorBar => {
    // Like fertility of planets, can be positive or negative.
    const left = _$(factorBar, C.FactorBar.left)!.children[0];
    const right = _$(factorBar, C.FactorBar.right)!.children[0];
    const valueLeft = refAttributeValue(left, 'value');
    const valueRight = refAttributeValue(right, 'value');
    watchEffectWhileNodeAlive(factorBar, () => {
      factorBar.title =
        Number(valueLeft.value) === 0
          ? percent2(Number(valueRight.value))
          : percent2(-Number(valueLeft.value));
    });
  });

  subscribe($$(document, C.SliderView.container), container => {
    const handle = _$(container, 'rc-slider-handle')!;
    const value = refAttributeValue(handle, 'aria-valuenow');
    // Differentiate between sliders from 0-1 and 1-X.
    const max = handle.getAttribute('aria-valuemax');
    watchEffectWhileNodeAlive(container, () => {
      container.title =
        max === '1' ? percent2(Number(value.value)) : percent2(Number(value.value) / Number(max));
    });
  });

  subscribe($$(document, C.OrderSlot.container), container => {
    const progress = _$(container, C.OrderSlot.progress);
    // Queued orders do not have a progress element.
    if (!progress) {
      return;
    }
    const value = refAttributeValue(progress, 'style');
    watchEffectWhileNodeAlive(progress, () => {
      container.title = percent2(parseFloat(value.value?.replace(/[^0-9.]/g, '') ?? '') / 100);
    });
  });
}

features.add(import.meta.url, init, 'Adds tooltips to all progress bars');
