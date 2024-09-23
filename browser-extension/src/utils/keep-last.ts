import { observeDescendantListChanged } from '@src/utils/mutation-observer';

export function keepLast(owner: Node, getParent: () => Element | undefined | null, child: Node) {
  observeDescendantListChanged(owner, () => {
    const parent = getParent();
    if (parent && parent.lastChild !== child) {
      parent.appendChild(child);
    }
  });
}
