import { isValidUrl } from '@src/utils/is-valid-url';
import { prunBtoa } from '@src/infrastructure/prun-ui/base64';

export function correctXitWeb(parts: string[]) {
  const isXitWeb = parts[0].toUpperCase() === 'XIT' && parts[1].toUpperCase() === 'WEB';
  if (!isXitWeb || !isValidUrl(parts[2]) || parts[3]) {
    return;
  }

  parts[2] =
    prunBtoa(parts[2])
      .match(/.{1,200}/g)
      ?.join(' ') || '';
}
