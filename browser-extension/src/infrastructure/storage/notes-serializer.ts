import { downloadJson, uploadJson } from '@src/utils/download-json';
import system from '@src/system';
import { deepToRaw } from '@src/utils/deep-to-raw';
import { applyNotes, Note, notes, watchNotes } from '@src/store/notes';

const fileType = 'rp-notes';

export async function loadNotes() {
  const saved = await system.storage.local.get(fileType);
  if (saved[fileType]) {
    applyNotes(saved[fileType]);
  }
  watchNotes(() => {
    void system.storage.local.set({
      [fileType]: deepToRaw(notes),
    });
  });
}

export function importNotes() {
  uploadJson(json => {
    if (json?.type !== fileType) {
      return;
    }
    applyNotes(json.data);
  });
}

export function importPmmgNotes() {
  uploadJson(json => {
    if (!json) {
      return;
    }
    const pmmg = json['PMMG-Notes'];
    if (pmmg) {
      const notes = Object.keys(pmmg).map(x => [x, pmmg[x]] as Note);
      applyNotes({ notes });
    }
  });
}

export function exportNotes() {
  const json = {
    type: fileType,
    data: notes,
  };
  downloadJson(json, `${fileType}-${Date.now()}.json`);
}
