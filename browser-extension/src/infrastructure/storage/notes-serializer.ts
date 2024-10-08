import { uploadJson } from '@src/utils/download-json';
import { applyLegacyNotes, applyPmmgNotes } from '@src/store/notes';

const fileType = 'rp-notes';

export function importNotesLegacy() {
  uploadJson(json => {
    if (json?.type !== fileType) {
      return;
    }
    applyLegacyNotes(json.data.notes);
  });
}

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
