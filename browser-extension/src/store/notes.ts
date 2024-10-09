import { userData } from '@src/store/user-data';
import { v4 as uuidv4 } from 'uuid';

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

export function applyPmmgNotes(pmmg: Record<string, string>) {
  userData.notes = Object.keys(pmmg).map(x => ({
    id: createId(),
    name: x,
    text: pmmg[x],
  }));
}

const createId = () => uuidv4().replaceAll('-', '');
