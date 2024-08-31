import { reactive, watch } from 'vue';
import system from '@src/system';
import { deepToRaw } from '@src/utils/deep-to-raw';

type Note = [string, string];

export const notes = reactive({
  notes: [] as Note[],
});

export function deleteNote(name: string) {
  notes.notes = notes.notes.filter(x => x[0] !== name);
}

const key = 'rp-notes';

export async function loadNotes() {
  const savedSettings = await system.storage.local.get(key);
  if (savedSettings[key]) {
    Object.assign(notes, savedSettings[key]);
  }
  let saveQueued = false;

  watch(
    notes,
    () => {
      if (!saveQueued) {
        queueMicrotask(() => {
          void system.storage.local.set({
            [key]: deepToRaw(notes),
          });
          saveQueued = false;
        });
        saveQueued = true;
      }
    },
    { deep: true },
  );
}
