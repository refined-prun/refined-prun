import { showWarningDialog, createLink, createEmptyTableRow, createTable, Popup } from '@src/util';
import { Style } from '@src/legacy';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { userData } from '@src/store/user-data';
import removeArrayElement from '@src/utils/remove-array-element';

// All functions associated with the summary screen
export async function createSummaryScreen(tile) {
  // Add row on top for creating a new action package
  const createRow = document.createElement('div');
  createRow.classList.add(...Style.ActionBarContainer);
  createRow.style.paddingTop = '2px';
  tile.appendChild(createRow);

  const createButtonContainer = document.createElement('div');
  createButtonContainer.classList.add(...Style.ActionBarElement);
  createRow.appendChild(createButtonContainer);

  const createButton = document.createElement('button');
  createButton.textContent = 'CREATE NEW';
  createButton.classList.add(...Style.Button);
  createButton.classList.add(...Style.ButtonPrimary);
  createButtonContainer.appendChild(createButton);

  // Generate popup asking for name of package
  createButton.addEventListener('click', () => {
    const popup = new Popup(tile, 'Create Action Package');
    popup.addPopupRow('text', 'Name', undefined, undefined, undefined);

    popup.addPopupRow('button', 'CMD', 'OPEN', undefined, () => {
      const nameRow = popup.getRowByName('Name');
      if (nameRow.rowInput.value && nameRow.rowInput.value != '') {
        showBuffer('XIT ACTION_GEN_' + nameRow.rowInput.value.split(' ').join('_'));
        popup.destroy();
      } else {
        nameRow.row.classList.add(...Style.FormError);
      }
    });
  });

  // Add import button
  const importButtonContainer = document.createElement('div');
  importButtonContainer.classList.add(...Style.ActionBarElement);
  createRow.appendChild(importButtonContainer);

  const importButton = document.createElement('button');
  importButton.textContent = 'IMPORT';
  importButton.classList.add(...Style.Button);
  importButton.classList.add(...Style.ButtonPrimary);
  importButtonContainer.appendChild(importButton);

  // Generate popup to deal with import
  importButton.addEventListener('click', () => {
    const popup = new Popup(tile, 'Import Action Package');
    popup.addPopupRow(
      'dropdown',
      'Type',
      ['Paste JSON', 'Upload JSON', 0],
      'Which style of import to use. Ping Pi314 on Discord for format specifics. Official documentation coming soon.',
      () => {
        // Change the next row to the correct type of import row
        popup.removePopupRow(1);

        const typeRow = popup.getRowByName('Type');
        const importType = typeRow.rowInput.value;

        let importRow;
        let importElem;

        switch (importType) {
          case 'Paste JSON': {
            popup.addPopupRow('text', 'Import', undefined, undefined, undefined);
            break;
          }
          case 'Upload JSON': {
            popup.addPopupRow('button', 'Import', 'UPLOAD', undefined, () => {
              // Trigger file import
              fileInput.click();
            });
            importRow = popup.getRowByName('Import');
            importElem = importRow.rowInput; // The import button

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            fileInput.style.display = 'none';
            importElem.appendChild(fileInput);
            break;
          }
        }

        popup.moveRowToBottom(1);
      },
    );

    // Default import row
    popup.addPopupRow('text', 'Import', undefined, undefined, undefined);

    // Save row
    popup.addPopupRow('button', 'CMD', 'IMPORT', undefined, async () => {
      // Parse then save the imported data
      const typeRow = popup.getRowByName('Type');
      const importType = typeRow.rowInput.value;

      const importRow = popup.getRowByName('Import');

      switch (importType) {
        case 'Paste JSON': {
          const rawData = importRow.rowInput.value;
          try {
            const parsedData = JSON.parse(rawData);
            if (!parsedData.global?.name) {
              importRow.row.classList.add(...Style.FormError);
              return;
            }

            const existing = userData.actionPackages.find(
              x => x.global.name === parsedData.global.name,
            );
            if (existing) {
              const index = userData.actionPackages.indexOf(existing);
              userData.actionPackages[index] = existing;
            } else {
              userData.actionPackages.push(parsedData);
            }
            popup.destroy();
          } catch {
            importRow.row.classList.add(...Style.FormError);
            return;
          }
          return;
        }
        case 'Upload JSON': {
          const fileImport = importRow.rowInput.children[0];
          if (fileImport) {
            if (fileImport.files && fileImport.files[0]) {
              const file = fileImport.files[0];

              const reader = new FileReader();
              reader.onload = async e => {
                // Do the saving in here rather than at the end
                if (!e || !e.target) {
                  return;
                }
                try {
                  const parsedData = JSON.parse(e.target.result as string);
                  if (!parsedData.global?.name) {
                    importRow.row.classList.add(...Style.FormError);
                    return;
                  }

                  const existing = userData.actionPackages.find(
                    x => x.global.name === parsedData.global.name,
                  );
                  if (existing) {
                    const index = userData.actionPackages.indexOf(existing);
                    userData.actionPackages[index] = existing;
                  } else {
                    userData.actionPackages.push(parsedData);
                  }
                  popup.destroy();
                } catch {
                  importRow.row.classList.add(...Style.FormError);
                  return;
                }
              };
              reader.readAsText(file);
              return;
            } else {
              importRow.row.classList.add(...Style.FormError);
              return;
            }
          }

          importRow.row.classList.add(...Style.FormError);
          break;
        }
      }
    });
  });

  // Now generate table of all action packages
  const table = createTable(tile, ['Name', 'Execute', 'Edit', 'Cmds']);

  if (userData.actionPackages.length == 0) {
    table.appendChild(
      createEmptyTableRow(4, 'No action packages found. Click above to create one'),
    );
  }

  for (const pkg of userData.actionPackages) {
    const friendlyName = pkg.global.name.split('_').join(' ');
    const paramName = pkg.global.name.split(' ').join('_');

    const row = document.createElement('tr');

    // Name column
    const nameColumn = document.createElement('td');
    nameColumn.appendChild(createLink(friendlyName, 'XIT ACTION_' + paramName));
    row.appendChild(nameColumn);

    // Execute column (pulls up execution screen)
    const execColumn = document.createElement('td');
    const execButton = document.createElement('button');
    execButton.textContent = 'EXECUTE';
    execButton.classList.add(...Style.Button);
    execButton.classList.add(...Style.ButtonPrimary);
    execColumn.appendChild(execButton);
    row.appendChild(execColumn);
    execButton.addEventListener('click', () => {
      showBuffer('XIT ACTION_' + paramName);
    });

    // Edit column (pulls up GEN screen)
    const editColumn = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'EDIT';
    editButton.classList.add(...Style.Button);
    editButton.classList.add(...Style.ButtonPrimary);
    editColumn.appendChild(editButton);
    row.appendChild(editColumn);
    editButton.addEventListener('click', () => {
      showBuffer('XIT ACTION_EDIT_' + paramName);
    });

    // Other commands (delete, copy in the future?)
    const cmdColumn = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'delete';
    deleteButton.classList.add(...Style.SmallButton);
    cmdColumn.appendChild(deleteButton);
    row.appendChild(cmdColumn);
    deleteButton.addEventListener('click', () => {
      showWarningDialog(
        tile,
        'Are you sure you want to delete this action package?',
        'Confirm',
        () => {
          removeArrayElement(userData.actionPackages, pkg);
        },
      );
    });

    table.appendChild(row);
  }
}
