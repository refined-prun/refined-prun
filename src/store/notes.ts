import { userData } from '@src/store/user-data';
import { createId } from '@src/store/create-id';

export function createNote(name: string) {
  const id = createId();
  userData.notes.push({
    id,
    name,
    text: '',
  });
  return id;
}

export function deleteNote(note: UserData.Note) {
  userData.notes = userData.notes.filter(x => x !== note);
}
