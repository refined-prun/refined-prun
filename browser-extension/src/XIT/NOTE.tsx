import {
  clearChildren,
  createLink,
  createTextSpan,
  getLocalStoragePromise,
  setLocalStoragePromise,
  showWarningDialog,
  showBuffer,
  Popup,
} from '../util';
import { Style } from '../Style';
import xit from './xit-registry';
import { createXitAdapter } from '@src/XIT/LegacyXitAdapter';
import features from '@src/feature-registry';

class Notes {
  private tile: HTMLDivElement;
  private parameters: string[];
  public name = 'NOTE';

  constructor(tile, parameters) {
    this.tile = tile;
    this.parameters = parameters;
  }

  create_buffer() {
    CreateNotes(this.tile, this.parameters);
  }

  update_buffer() {}

  destroy_buffer() {}
}

const StorageName = 'PMMG-Notes';

class NoteStructure {
  public textbox: HTMLTextAreaElement;
  public overlay: HTMLPreElement;
  public wrapper: HTMLDivElement;

  constructor() {
    this.wrapper = document.createElement('div');
    this.textbox = document.createElement('textarea');
    this.overlay = document.createElement('pre');

    this.wrapper.appendChild(this.textbox);
    this.wrapper.appendChild(this.overlay);

    // Add styles
    this.textbox.classList.add('pb-note-textbox');
    this.overlay.classList.add('pb-note-overlay');
    this.textbox.spellcheck = false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function CreateNotes(tile: HTMLDivElement, parameters: any[]) {
  if (!tile) {
    throw new Error("Parameter 'tile' is required.");
  }
  if (!parameters) {
    throw new Error("Parameter 'parameters' is required.");
  }
  if (!parameters[0]) {
    throw new Error("Parameter 'parameters' must contain one or more values.");
  }

  clearChildren(tile);

  if (parameters.length == 1) {
    // Display table of notes and links to open each or delete each
    return await displayNotesList(tile);
  }

  // Display the specified note
  const noteName = parameters.slice(1).join('_');

  const nameDiv = document.createElement('div');
  nameDiv.classList.add('title', 'note-title');
  nameDiv.textContent = noteName;
  nameDiv.style.paddingLeft = '10px';
  tile.append(nameDiv);

  const note = new NoteStructure();
  tile.appendChild(note.wrapper);

  await displayStoredNote(note, noteName);
}

async function displayNotesList(tile: HTMLDivElement): Promise<void> {
  return getLocalStoragePromise(StorageName).then(value => {
    generateNotesTable(value[StorageName], tile);
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateNotesTable(notesStorage: { [p: string]: any }, tile: HTMLDivElement) {
  if (!tile) {
    throw new Error("Parameter 'tile' is required.");
  }

  const notesTable = document.createElement('table');

  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  thead.append(tr);
  notesTable.append(thead);

  for (const title of ['Name', 'Length', 'Delete']) {
    const th = document.createElement('th');
    th.textContent = title;
    th.style.paddingTop = '0';
    tr.append(th);
  }

  const tbody = document.createElement('tbody');
  notesTable.append(tbody);

  if (!notesStorage) {
    const tr = document.createElement('tr');
    tbody.append(tr);

    const td = document.createElement('td');
    td.colSpan = 3;
    td.textContent = 'No Notes';
    tr.append(td);

    return;
  }

  const names = Array.from(Object.keys(notesStorage));

  names.forEach(noteName => {
    const noteText = notesStorage[noteName] as string;

    const row = document.createElement('tr');
    tbody.append(row);

    const nameColumn = document.createElement('td');
    const lengthColumn = document.createElement('td');
    const buttonsColumn = document.createElement('td');

    row.append(nameColumn, lengthColumn, buttonsColumn);

    const openNoteLink = createLink(noteName, `XIT NOTES_${noteName}`);
    nameColumn.append(openNoteLink);

    const noteCounter = document.createElement('div');
    noteCounter.innerHTML = noteText;
    const innerText = noteCounter.textContent || '';
    let lengthText = `${innerText.length.toLocaleString()} character`;
    if (noteText.length != 1) lengthText += 's';
    lengthColumn.append(createTextSpan(lengthText));

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'DELETE';

    deleteButton.addEventListener('click', () => {
      showWarningDialog(tile, `Are you sure you want to delete the note "${noteName}"?`, 'Confirm', () => {
        saveNote(noteName, null).then(() => {
          row.remove();
        });
      });
    });
    buttonsColumn.append(deleteButton);
  });

  tile.append(notesTable);

  const newButton = document.createElement('button');
  newButton.classList.add(...Style.Button);
  newButton.classList.add(...Style.ButtonPrimary);
  newButton.style.margin = '5px';

  newButton.textContent = 'NEW NOTE';
  newButton.addEventListener('click', () => {
    const popup = new Popup(tile, 'New Note');
    popup.addPopupRow(
      'text',
      'Note Name',
      '',
      'The name of the note. The command to access will be XIT NOTE_{name}',
      () => {},
    );
    popup.addPopupRow('button', 'CMD', 'Create', undefined, () => {
      const nameRow = popup.getRowByName('Note Name');
      if (!nameRow || !nameRow.rowInput) {
        return;
      }
      showBuffer(`XIT NOTE_${nameRow.rowInput.value || ''}`);
      popup.destroy();
    });
  });
  tile.appendChild(newButton);
}

async function saveNote(noteName: string, noteText: string | null): Promise<void> {
  let storage = await getLocalStoragePromise(StorageName);

  if (!storage) {
    storage = {};
  }

  if (!storage[StorageName]) {
    storage[StorageName] = {};
  }

  if (!noteText || noteText.length === 0) {
    storage[StorageName][noteName] = undefined;
  } else {
    storage[StorageName][noteName] = noteText;
  }

  return await setLocalStoragePromise(storage);
}

async function displayStoredNote(note: NoteStructure, noteName: string) {
  const storageValue = await getLocalStoragePromise(StorageName);
  let notesStorage = storageValue[StorageName];

  if (!notesStorage) {
    notesStorage = {};
  }

  let noteText = notesStorage[noteName] ?? '';

  note.textbox.value = noteText;

  note.textbox.addEventListener('input', () => {
    noteText = note.textbox.value;

    saveNote(noteName, noteText).catch(reason => {
      console.error('Failed to save note to local storage: %o', reason);
    });

    renderNoteText(note, noteText);
  });

  note.textbox.addEventListener('scroll', () => {
    note.overlay.scrollTop = note.textbox.scrollTop;
    note.overlay.scrollLeft = note.textbox.scrollLeft;
  });

  renderNoteText(note, noteText);
}

function renderNoteText(note: NoteStructure, noteText: string): void {
  // Update overlay
  if (noteText[noteText.length - 1] == '\n') {
    noteText += ' ';
  } // Account for final new lines

  noteText = noteText.replace(new RegExp('&', 'g'), '&amp;').replace(new RegExp('<', 'g'), '&lt;'); // Allow for HTML tags

  const regexp = /\b(?:[a-zA-Z0-9]{1,3}\.(?:CI1|IC1|AI1|NC1|CI2|NC2))(?!<)/;
  let matches;
  let counter = 0;
  do {
    matches = noteText.match(regexp);
    if (!matches || !matches[0]) {
      break;
    }

    noteText = noteText.replace(regexp, `<span class="pb-note-link">${matches[0]}</span>`);

    counter++;
    if (counter > 100) {
      break;
    }
  } while (matches);

  note.overlay.innerHTML = noteText;

  const links = note.overlay.getElementsByClassName('pb-note-link');
  Array.from(links).forEach(link => {
    link.addEventListener('click', () => {
      showBuffer(`CXP ${link.textContent}`);
    });
  });
}

function init() {
  xit.add({
    command: ['NOTE', 'NOTES'],
    name: 'NOTE',
    component: createXitAdapter(Notes),
  });
}

features.add({
  id: 'xit-note',
  init,
});
