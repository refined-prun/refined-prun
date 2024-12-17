export function isValidUrl(url?: string | null) {
  if (!url) {
    return false;
  }
  try {
    return Boolean(new URL(url));
  } catch {
    return false;
  }
}
