import { isValidUrl } from '@src/utils/is-valid-url';
import { prunBtoa } from '@src/infrastructure/prun-ui/base64';

export function correctXitWeb(parts: string[]) {
  const isXitWeb = parts[0].toUpperCase() === 'XIT' && parts[1].toUpperCase() === 'WEB';
  if (!isXitWeb || parts.length >= 4) {
    return;
  }

  let url = parts[2];
  if (!isValidUrl(url)) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return;
    }

    url = 'https://' + url;
    if (!isValidUrl(url)) {
      return;
    }
  }

  parts[2] =
    prunBtoa(url)
      .match(/.{1,200}/g)
      ?.join(' ') || '';
}
