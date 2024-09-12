import { createTextSpan, createSelectOption } from '@src/util';
import { Style } from '@src/Style';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';

export function needsConfiguration(action) {
  switch (action.type) {
    case 'MTRA':
      if (action.dest && action.dest == 'Configure on Execution') {
        return true;
      } else if (action.origin && action.origin == 'Configure on Execution') {
        return true;
      }
      break;
    // No configuration for CX buy, so no need to switch
  }

  return false;
}

// Create configuration UI for the n-th action package action (controlled by currentConfigIndex). Will loop through all actions by incrementing and recursively running
export function createConfigureUI(
  packageConfig,
  tile,
  rawActionPackage,
  validateButton,
  executeButton,
  messageBox,
  currentConfigIndex,
) {
  if (currentConfigIndex == rawActionPackage.actions.length) {
    // We've stepped through everything and configuration is done
    validateButton.classList.remove(...Style.ButtonDisabled);
    executeButton.classList.remove(...Style.ButtonDisabled);
    validateButton.classList.add(...Style.ButtonPrimary);
    executeButton.classList.add(...Style.ButtonPrimary);
    validateButton.disabled = false;
    executeButton.disabled = false;
    return;
  }

  const action = rawActionPackage.actions[currentConfigIndex];

  if (!needsConfiguration(action)) {
    // Loop again since no action is needed
    createConfigureUI(
      packageConfig,
      tile,
      rawActionPackage,
      validateButton,
      executeButton,
      messageBox,
      currentConfigIndex + 1,
    );
    return;
  }

  const configInfo = document.createElement('div');
  configInfo.classList.add('pb-config');
  tile.appendChild(configInfo);

  // Create area where current config description is listed
  const currentConfigDiv = document.createElement('div');
  currentConfigDiv.style.marginLeft = '5px';
  currentConfigDiv.style.marginTop = '5px';
  const currentConfig = createTextSpan('Awaiting First Config');
  currentConfigDiv.appendChild(currentConfig);
  configInfo.appendChild(currentConfigDiv);

  // Create configuration controls
  const configControls = document.createElement('div');
  configControls.style.marginLeft = '5px';
  configControls.style.marginTop = '5px';
  configInfo.appendChild(configControls);

  if (!rawActionPackage.actions[currentConfigIndex]) {
    addMessage(
      messageBox,
      'Error: Missing action at index ' + currentConfigIndex.toLocaleString(undefined),
    );
  }

  // Create controls based on action type
  switch (action.type) {
    case 'MTRA': {
      if (action.group) {
        currentConfig.textContent = 'Configure transfer locations for group ' + action.group;
      } else {
        addMessage(
          messageBox,
          'Error: Missing group on action at index ' + currentConfigIndex.toLocaleString(undefined),
        );
      }
      const storageNames = [...storagesStore.all.value].sort(storageSort).map(parseStorageName);
      let originSelect;
      let destSelect;

      if (action.origin && action.origin == 'Configure on Execution') {
        // Create dropdown to select origin
        const originDiv = document.createElement('div');
        originDiv.style.marginBottom = '2px';

        originDiv.appendChild(createTextSpan('Origin: '));

        originSelect = document.createElement('select');
        originSelect.classList.add('select');
        originDiv.appendChild(originSelect);

        storageNames.forEach(text => {
          originSelect.appendChild(createSelectOption(text, text));
        });

        configControls.appendChild(originDiv);
      }
      if (action.dest && action.dest == 'Configure on Execution') {
        // Create dropdown to select destination
        const destDiv = document.createElement('div');
        destDiv.style.marginBottom = '5px';

        destDiv.appendChild(createTextSpan('Destination: '));

        destSelect = document.createElement('select');
        destSelect.classList.add('select');
        destDiv.appendChild(destSelect);

        storageNames.forEach(text => {
          destSelect.appendChild(createSelectOption(text, text));
        });

        configControls.appendChild(destDiv);
      }
      // Create configure button
      const configureButton = document.createElement('button');
      configureButton.classList.add(...Style.Button);
      configureButton.classList.add(...Style.ButtonPrimary);
      configureButton.textContent = 'CONFIGURE';
      configControls.appendChild(configureButton);

      // Do configuration actions when clicked
      configureButton.addEventListener('click', () => {
        packageConfig.actions[currentConfigIndex] = {};
        if (originSelect) {
          packageConfig.actions[currentConfigIndex].origin = originSelect.value;
        }
        if (destSelect) {
          packageConfig.actions[currentConfigIndex].dest = destSelect.value;
        }

        // Clean up elements
        tile.removeChild(configInfo);

        // Loop again
        createConfigureUI(
          packageConfig,
          tile,
          rawActionPackage,
          validateButton,
          executeButton,
          messageBox,
          currentConfigIndex + 1,
        );
      });

      break;
    }
    default:
      addMessage(
        messageBox,
        'Error: Unrecognized configuration type at index ' +
          currentConfigIndex.toLocaleString(undefined),
      );
  }
}

function addMessage(messageBox, message, clear?) {
  messageBox.textContent = clear
    ? message
    : message + (messageBox.textContent == '' ? '' : '\n') + messageBox.textContent;
}

// Sort storages into an order based on type
function storageSort(a: PrunApi.Store, b: PrunApi.Store) {
  const storagePriorityMap = {
    FTL_FUEL_STORE: 0,
    STL_FUEL_STORE: 1,
    SHIP_STORE: 2,
    STORE: 3,
    WAREHOUSE_STORE: 4,
  };
  return a.type && b.type && storagePriorityMap[a.type] > storagePriorityMap[b.type] ? 1 : -1;
}

function parseStorageName(storage) {
  switch (storage.type) {
    case 'STL_FUEL_STORE':
      return storage.name + ' STL Store';
    case 'FTL_FUEL_STORE':
      return storage.name + ' FTL Store';
    case 'SHIP_STORE':
      return storage.name + ' Cargo';
    case 'STORE':
      return storage.PlanetName + ' Base';
    case 'WAREHOUSE_STORE':
      return storage.PlanetName + ' Warehouse';
  }

  return 'Error, unable to parse';
}
