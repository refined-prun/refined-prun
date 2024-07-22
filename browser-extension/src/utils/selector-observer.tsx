import { h } from 'dom-chef';
import { css } from 'code-tag';
import onetime from 'onetime';
import { ParseSelector } from 'typed-query-selector/parser.js';

import getCallerID from './caller-id.js';

type ObserverListener<ExpectedElement extends Element> = (element: ExpectedElement, options: SignalAsOptions) => void;

const animation = 'rprun-selector-observer';
const getListener =
  <Selector extends string, ExpectedElement extends ParseSelector<Selector, HTMLElement>>(
    seenMark: string,
    selector: Selector,
    callback: ObserverListener<ExpectedElement>,
    signal?: AbortSignal,
  ) =>
  (event: AnimationEvent) => {
    const target = event.target as ExpectedElement;
    // The target can match a selector even if the animation actually happened
    // on a ::before pseudo-element, so it needs an explicit exclusion here
    if (target.classList.contains(seenMark) || !target.matches(selector)) {
      return;
    }

    // Removes this specific selector’s animation once it was seen
    target.classList.add(seenMark);

    callback(target, { signal });
  };

const registerAnimation = onetime((): void => {
  document.head.append(<style>{`@keyframes ${animation} {}`}</style>);
});

export default function observeReadyElements<
  Selector extends string,
  ExpectedElement extends ParseSelector<Selector, HTMLElement>,
>(
  selectors: Selector | readonly Selector[],
  callback: ObserverListener<ExpectedElement>,
  { signal }: SignalAsOptions = {},
): void {
  if (signal?.aborted) {
    return;
  }

  const selector = String(selectors); // Array#toString() creates a comma-separated string
  const seenMark = 'rprun-seen-' + getCallerID();

  registerAnimation();

  const rule = document.createElement('style');
  if (__DEV__) {
    // For debuggability
    rule.setAttribute('s', selector);
  }

  rule.textContent = css`
    :where(${String(selector)}):not(.${seenMark}) {
      animation: 1ms ${animation};
    }
  `;
  document.body.prepend(rule);
  signal?.addEventListener('abort', () => {
    rule.remove();
  });
  const listener = getListener(seenMark, selector, callback as ObserverListener<HTMLElement>, signal);
  window.addEventListener('animationstart', listener, { signal });
}
