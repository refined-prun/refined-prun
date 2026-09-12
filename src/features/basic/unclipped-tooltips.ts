import $style from './unclipped-tooltips.module.css';

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
    tooltip.style.whiteSpace = getComputedStyle(target).whiteSpace;
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

    const side = sides.find(x => fits(position(x))) ?? sides[sides.length - 1];
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

function init() {
  applyCssRule('[data-tooltip]', $style.hideTooltip);
  prepareTooltips();
}

features.add(import.meta.url, init, 'Prevents tooltips from being clipped by tile boundaries.');
