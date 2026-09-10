import { prunCssStylesheets } from '@src/infrastructure/prun-ui/prun-css';
import $style from './prun-bugs.module.css';
import { clickElement } from '@src/util';

function removeMobileCssRules() {
  for (const style of prunCssStylesheets) {
    const styleSheet = style.sheet!;
    const rules = styleSheet.cssRules;
    try {
      for (let j = rules.length - 1; j >= 0; j--) {
        const rule = rules[j];
        if (rule instanceof CSSMediaRule && rule.media.mediaText.includes('screen')) {
          styleSheet.deleteRule(j);
        }
      }
    } catch (e) {
      console.log(`Could not modify stylesheet: ${styleSheet.href}, Error: ${e}`);
    }
  }
}

function disableInvalidPopidSliders(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), row => {
    subscribe($$(row, 'rc-slider'), async slider => {
      const sliderMarks = Array.from((await $(slider, 'rc-slider-mark')).children);
      const sliderMaxMark = sliderMarks[sliderMarks.length - 1];
      const sliderMax = parseFloat(sliderMaxMark.textContent);
      const sliderValueMark = sliderMarks.findLast(x =>
        x.classList.contains('rc-slider-mark-text-active'),
      );
      if (!sliderValueMark) {
        return;
      }
      const sliderValue = parseFloat(sliderValueMark.textContent);
      const reserveCell = row.children[3];
      if (reserveCell === undefined) {
        return;
      }
      const reserveBar = await $(reserveCell, 'progress');
      if (reserveBar.value - sliderValue + sliderMax > reserveBar.max) {
        // If the slider is filled, disabling it could lock it in an invalid position.
        // So, we first minimize the slider value by clicking the min mark.
        await clickElement(sliderMarks[0] as HTMLElement);
        slider.classList.add('rc-slider-disabled');
        slider.style.pointerEvents = 'none';
      }
    });
  });
}

function fixZOrder() {
  applyCssRule(
    [
      `.${C.ComExOrdersPanel.filter}`,
      `.${C.LocalMarket.filter}`,
      `.${C.ContractsListTable.filter}`,
    ],
    $style.filter,
  );
  applyCssRule(`.${C.ScrollView.track}`, $style.scrollTrack);
}

function prepareTooltips() {
  if (document.getElementById('rp-tooltip')) {
    return;
  }
  const tooltip = document.createElement('div');
  tooltip.id = 'rp-tooltip';
  tooltip.popover = 'auto';
  tooltip.classList.add($style.popoverTooltip, C.fonts.fontRegular);
  document.documentElement.appendChild(tooltip);
  let activeTarget: Element | null = null;
  function showTooltip(target: Element) {
    const text = target.getAttribute('data-tooltip');
    if (!text) {
      hideTooltip(target);
      return;
    }

    activeTarget = target;
    tooltip.textContent = text;
    // Reset the tooltip position to maintain deterministic behavior.
    tooltip.style.left = '0px';
    tooltip.style.top = '0px';
    tooltip.showPopover();

    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    // Gap between tooltip and target.
    const gap = 8;
    // Minimum gap between tooltip and edge of screen.
    const padding = 4;
    const preferred = target.getAttribute('data-tooltip-position') ?? 'bottom';

    // Try the requested side first, then its opposite, then perpendicular sides.
    const sides: string[] = {
      top: ['top', 'bottom', 'right', 'left'],
      right: ['right', 'left', 'bottom', 'top'],
      bottom: ['bottom', 'top', 'right', 'left'],
      left: ['left', 'right', 'top', 'bottom'],
    }[preferred] ?? ['bottom', 'top', 'right', 'left'];

    const position = (side: string) => {
      switch (side) {
        case 'top':
          return {
            left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
            top: targetRect.top - tooltipRect.height - gap,
          };

        case 'right':
          return {
            left: targetRect.right + gap,
            top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
          };

        case 'left':
          return {
            left: targetRect.left - tooltipRect.width - gap,
            top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
          };

        case 'bottom':
        default:
          return {
            left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
            top: targetRect.bottom + gap,
          };
      }
    };

    const fits = (p: { left: number; top: number }) =>
      p.left >= padding &&
      p.top >= padding &&
      p.left + tooltipRect.width <= window.innerWidth - padding &&
      p.top + tooltipRect.height <= window.innerHeight - padding;

    // Recursively find the first side that fits.
    const findSide = (remaining: string[]): string => {
      const side = remaining[0];

      if (fits(position(side)) || remaining.length === 1) {
        return side;
      }

      return findSide(remaining.slice(1));
    };

    const side = findSide(sides);
    let { left, top } = position(side);

    // If nothing fits, keep the chosen side but clamp the tooltip.
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));

    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.dataset.rpTooltipSide = side;
    const arrowPadding = 8;

    const arrowOffset =
      side === 'top' || side === 'bottom'
        ? targetRect.left + targetRect.width / 2 - left
        : targetRect.top + targetRect.height / 2 - top;

    const clampedArrowOffset =
      side === 'top' || side === 'bottom'
        ? Math.max(arrowPadding, Math.min(arrowOffset, tooltipRect.width - arrowPadding))
        : Math.max(arrowPadding, Math.min(arrowOffset, tooltipRect.height - arrowPadding));

    tooltip.style.setProperty('--rp-tooltip-arrow-offset', `${clampedArrowOffset}px`);
  }
  function hideTooltip(target: Element) {
    if (target !== activeTarget) {
      return;
    }
    activeTarget = null;
    tooltip.hidePopover();
  }
  const observer = new MutationObserver(x => {
    for (const { target } of x) {
      if (!(target instanceof Element)) {
        continue;
      }
      if (target !== activeTarget && !target.matches(':hover, :focus-within')) {
        continue;
      }
      showTooltip(target);
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-tooltip', 'data-tooltip-position'],
    subtree: true,
  });
  document.addEventListener('pointerover', x => {
    if (!(x.target instanceof Element)) {
      return;
    }
    const target = x.target.closest('[data-tooltip]');
    if (!target || activeTarget === target) {
      return;
    }
    showTooltip(target);
  });
  document.addEventListener('pointerout', x => {
    if (!(x.target instanceof Element)) {
      return;
    }
    const target = x.target.closest('[data-tooltip]');
    if (!target || (x.relatedTarget instanceof Node && target.contains(x.relatedTarget))) {
      return;
    }
    hideTooltip(target);
  });
  document.addEventListener('focusin', x => {
    if (!(x.target instanceof Element)) {
      return;
    }
    const target = x.target.closest('[data-tooltip]');
    if (!target || activeTarget === target) {
      return;
    }
    showTooltip(target);
  });
  document.addEventListener('focusout', x => {
    if (!(x.target instanceof Element)) {
      return;
    }
    const target = x.target.closest('[data-tooltip]');
    if (!target || (x.relatedTarget instanceof Node && target.contains(x.relatedTarget))) {
      return;
    }
    hideTooltip(target);
  });
}

function fixSliders() {
  applyCssRule('.rc-slider-dot', $style.rcSliderDotFixes);
  applyCssRule('.rc-slider-handle', $style.rcSliderHandleFixes);
  applyCssRule('.rc-slider-step', $style.rcSliderStepFixes);
}

function preventDragSelection() {
  const noSelectClass = 'rp-no-select-drag';
  applyCssRule(`.${noSelectClass} *`, $style.noSelect);

  const queueReset = () => {
    if (!document.body.classList.contains(noSelectClass)) {
      return;
    }
    requestAnimationFrame(() => {
      document.getSelection()?.removeAllRanges();
      document.body.classList.remove(noSelectClass);
    });
  };

  document.addEventListener('dragstart', e => {
    const target = e.target as Element;
    if (target.closest('[draggable="true"]') === null) {
      return;
    }
    document.body.classList.add(noSelectClass);
  });

  document.addEventListener('dragend', queueReset);
  window.addEventListener('blur', queueReset);
}

function init() {
  removeMobileCssRules();
  fixZOrder();
  fixSliders();
  preventDragSelection();

  // Prevents top-right user info from shrinking.
  applyCssRule(`.${C.Head.container}`, $style.head);

  // Item sub-labels are missing word-break.
  applyCssRule(`.${C.ColoredIcon.subLabel}`, $style.subLabel);

  // Removes GridItemView background color.
  applyCssRule(`.${C.GridItemView.container}`, $style.gridItem);
  // Prevent layout shifts when items become selected by making the border consistent width.
  applyCssRule(`.${C.GridItemView.selected}`, $style.gridItemSelected);

  // Adds text centering to GridItemView name.
  applyCssRule(`.${C.GridItemView.name}`, $style.gridItemName);

  // The overlay stops materials from being clickable.
  applyCssRule(['PROD', 'PRODQ'], `.${C.OrderTile.overlay}`, $style.disablePointerEvents);

  // Prevent PROD buffer vertical scroll bar gutter from being always visible.
  applyCssRule('PROD', `.${C.SiteProductionLines.container}`, $style.containerScrollbarGutter);

  // User search results box in GIFT is too big to fit in the tile.
  applyCssRule('GIFT', `.${C.UserSelector.suggestionsContainer}`, $style.giftSearchResults);

  // Fixes the dot / arrow in system info being left skewed
  applyCssRule(
    'SYSI',
    `.${C.EnvironmentTable.gridContainer} .${C.ColoredValue.positive}`,
    $style.centerText,
  );
  applyCssRule(
    'SYSI',
    `.${C.EnvironmentTable.gridContainer} .${C.ColoredValue.negative}`,
    $style.centerText,
  );

  // Fix the tooltip arrow position.
  applyCssRule('[data-tooltip-position="bottom"]', $style.tooltipBottom);
  applyCssRule('[data-tooltip-position="right"]', $style.tooltipRight);

  // Fix tooltip clipping
  applyCssRule('[data-tooltip]', $style.hideTooltip);

  prepareTooltips();
  tiles.observe('POPID', disableInvalidPopidSliders);
}

features.add(import.meta.url, init, 'Fixes PrUn bugs.');
