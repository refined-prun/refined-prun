import { uploadJson } from '@src/utils/download-json';
import { applyPmmgNotes } from '@src/store/notes';

export function importPmmgNotes() {
  uploadJson(json => {
    if (!json) {
      return;
    }
    const pmmg = json['PMMG-Notes'];
    if (pmmg) {
      applyPmmgNotes(pmmg);
    }
  });
}
