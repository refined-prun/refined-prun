import oneMutation from 'one-mutation';

export default async function descendantPresent(
  element: Element,
  className: string,
  signal?: AbortSignal,
) {
  signal?.throwIfAborted();
  const childElements = element.getElementsByClassName(className);
  if (childElements.length > 0) {
    return childElements[0] as HTMLElement;
  }

  await oneMutation(element, {
    childList: true,
    subtree: true,
    signal,
    filter: () => childElements.length > 0,
  });

  signal?.throwIfAborted();
  return childElements[0] as HTMLElement;
}
