import { observeDescendantListChanged } from '@src/utils/mutation-observer';
import $style from './content-replacement.module.css';

// Displays replacement content without removing nodes owned by another renderer.
// React keeps references to its nodes, so clearing their parent with textContent or
// replaceChildren can cause a later removeChild call to throw NotFoundError.
// Hide the original content with CSS instead, and show it again when the replacement is empty.
export function createContentReplacement(root: Node, getTarget: () => Element | null | undefined) {
  const replacement = document.createElement('span');
  replacement.classList.add($style.replacement);

  observeDescendantListChanged(root, () => {
    const target = getTarget();
    if (!target || replacement.parentElement === target) {
      return;
    }

    replacement.style.fontSize = getComputedStyle(target).fontSize;
    target.classList.add($style.container);
    target.append(replacement);
  });

  return replacement;
}
