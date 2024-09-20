import { reactive, watch } from 'vue';

export type Note = [string, string];

export const notes = reactive({
  notes: [] as Note[],
});

export function deleteNote(note: Note) {
  notes.notes = notes.notes.filter(x => x !== note);
}

export function applyNotes(newNotes: { notes: Note[] }) {
  notes.notes.push(...newNotes.notes);
}

export async function watchNotes(save: () => void) {
  let saveQueued = false;

  watch(
    notes,
    () => {
      if (!saveQueued) {
        setTimeout(() => {
          save();
          saveQueued = false;
        }, 1000);
        saveQueued = true;
      }
    },
    { deep: true },
  );
}
