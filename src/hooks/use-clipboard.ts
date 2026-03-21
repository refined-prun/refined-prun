export function useClipboard() {
  const copied = ref(false);
  let timeout: ReturnType<typeof setTimeout> | undefined;

  onScopeDispose(() => clearTimeout(timeout));

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.error('Failed to copy to clipboard', e);
      return;
    }
    copied.value = true;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      copied.value = false;
    }, 1000);
  }

  return { copied, copy };
}
