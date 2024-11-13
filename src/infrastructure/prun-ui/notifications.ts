import oneMutation from 'one-mutation';

export async function waitNotificationLoaded(container: HTMLElement) {
  const content = await $(container, C.AlertListItem.content);
  // Don't mess with loading notifications
  const isLoaded = () => !content.textContent?.includes('…');
  if (!isLoaded()) {
    await oneMutation(content, {
      childList: true,
      subtree: true,
      characterData: true,
      filter: isLoaded,
    });
  }
  return content;
}
