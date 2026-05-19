import { clickElement } from '@src/util';
import onNodeDisconnected from '@src/utils/on-node-disconnected';

export function mirrorSubtree(origin: Element, target: Element, classes: string[]) {
  const cloneOf = new WeakMap<Node, Node>();
  const originOf = new WeakMap<Node, Node>();
  const mirroredRoots = new Map<Element, Element>();

  function deepClone(node: Node): Node {
    const clone = node.cloneNode(false);
    cloneOf.set(node, clone);
    originOf.set(clone, node);
    for (const child of Array.from(node.childNodes)) {
      clone.appendChild(deepClone(child));
    }
    return clone;
  }

  function matches(el: Element) {
    return classes.some(c => el.classList.contains(c));
  }

  function applyMutations(mutations: MutationRecord[]) {
    for (const m of mutations) {
      const cloneTarget = cloneOf.get(m.target);
      if (!cloneTarget) {
        continue;
      }
      if (m.type === 'characterData') {
        cloneTarget.nodeValue = m.target.nodeValue;
      } else if (m.type === 'attributes' && m.attributeName) {
        const name = m.attributeName;
        const value = (m.target as Element).getAttribute(name);
        const cloneEl = cloneTarget as Element;
        if (value === null) {
          cloneEl.removeAttribute(name);
        } else {
          cloneEl.setAttribute(name, value);
        }
      } else if (m.type === 'childList') {
        for (const removed of Array.from(m.removedNodes)) {
          const cloneChild = cloneOf.get(removed);
          if (cloneChild && cloneChild.parentNode === cloneTarget) {
            cloneTarget.removeChild(cloneChild);
          }
        }
        for (const added of Array.from(m.addedNodes)) {
          const cloneChild = deepClone(added);
          const refClone = m.nextSibling ? cloneOf.get(m.nextSibling) : null;
          if (refClone && refClone.parentNode === cloneTarget) {
            cloneTarget.insertBefore(cloneChild, refClone);
          } else {
            cloneTarget.appendChild(cloneChild);
          }
        }
      }
    }
  }

  function addMirror(child: Element) {
    const clone = deepClone(child) as Element;
    mirroredRoots.set(child, clone);
    target.appendChild(clone);
    const observer = new MutationObserver(applyMutations);
    observer.observe(child, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
  }

  function removeMirror(child: Element) {
    const clone = mirroredRoots.get(child);
    if (!clone) {
      return;
    }
    clone.remove();
    mirroredRoots.delete(child);
  }

  function syncTopLevel() {
    const present = new Set<Element>();
    for (const child of Array.from(origin.children)) {
      if (!matches(child)) {
        continue;
      }
      present.add(child);
      if (!mirroredRoots.has(child)) {
        addMirror(child);
      }
    }
    for (const child of Array.from(mirroredRoots.keys())) {
      if (!present.has(child)) {
        removeMirror(child);
      }
    }
  }

  syncTopLevel();
  new MutationObserver(syncTopLevel).observe(origin, { childList: true });

  onNodeDisconnected(origin, () => {
    for (const child of Array.from(mirroredRoots.keys())) {
      removeMirror(child);
    }
  });

  target.addEventListener('click', (event: Event) => {
    const cloneNode = event.target as Node | null;
    if (!cloneNode) {
      return;
    }
    const originNode = originOf.get(cloneNode);
    if (originNode instanceof HTMLElement) {
      void clickElement(originNode);
    }
  });
}
