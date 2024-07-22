import oneMutation from 'one-mutation';

export default async function childElementPresent(element: Element, className: string, signal?: AbortSignal) {
  signal?.throwIfAborted();
  const childElements = element.getElementsByClassName(className);
  if (childElements.length > 0) {
    return childElements[0];
  }

  await oneMutation(element, {
    childList: true,
    filter: () => childElements.length > 0,
  });

  signal?.throwIfAborted();
  return childElements[0];
}