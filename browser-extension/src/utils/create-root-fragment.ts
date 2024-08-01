import { castArray } from '@src/utils/cast-array';
import { ContainerNode } from 'preact';

/**
 * A Preact 11+ implementation of the `replaceNode` parameter from Preact 10.
 *
 * This creates a "Persistent Fragment" (a fake DOM element) containing one or more
 * DOM nodes, which can then be passed as the `parent` argument to Preact's `render()` method.
 */
export function createRootFragment(parent: Element, replaceNode: Arrayable<Node>): ContainerNode {
  replaceNode = castArray(replaceNode);
  const s = replaceNode[replaceNode.length - 1].nextSibling;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((parent as any).__k = {
    nodeType: 1,
    parentNode: parent,
    firstChild: replaceNode[0],
    childNodes: replaceNode,
    insertBefore: (c: Node, r: Node | null) => parent.insertBefore(c, r || s),
    appendChild: (c: Node) => parent.insertBefore(c, s),
    removeChild: (c: Element) => parent.removeChild(c),
    // @ts-expect-error This is needed apparently???
    contains: (c: Node | null) => parent.contains(c),
  });
}

export function appendRootFragment<K extends keyof HTMLElementTagNameMap>(parent: Element, tagName: K): ContainerNode {
  const fragment = document.createElement(tagName);
  parent.appendChild(fragment);
  return createRootFragment(parent, fragment);
}
