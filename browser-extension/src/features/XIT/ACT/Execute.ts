import {
  showSuccessDialog,
  sleep,
  changeValue,
  changeSelectValue,
  getBuffers,
  createTextSpan,
  getLocalStoragePromise,
} from '@src/util';
import { Style } from '@src/Style';
import { Selector } from '@src/Selector';
import { Stations } from '@src/GameProperties';
import { validateAction } from './Validate';
import { parseActionPackage } from './Parse';
import { needsConfiguration, createConfigureUI } from './Configure';
import { _$, _$$ } from '@src/utils/get-element-by-class-name';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import { starsStore } from '@src/infrastructure/prun-api/data/stars';

export async function createExecuteScreen(tile, packageName) {
  const title = document.createElement('h2');
  title.textContent = packageName;
  title.classList.add(...Style.DraftName);
  title.style.marginLeft = '5px';
  tile.appendChild(title);

  const storageValue = await getLocalStoragePromise('PMMG-Action');
  const storedActions = storageValue['PMMG-Action'] || {};

  const rawActionPackage = storedActions[packageName];

  // Create message box
  const messageBox = document.createElement('textarea');
  messageBox.classList.add('pb-read-textarea');
  messageBox.readOnly = true;
  tile.appendChild(messageBox);

  if (!rawActionPackage) {
    addMessage(
      messageBox,
      'Error: No action package detected. Open XIT ACTION_GEN_' +
        packageName.split(' ').join('_') +
        ' to create one',
    );
    return;
  }

  // Create basic buffer structure

  // Create array of "View", "Validate", "Execute" buttons
  const startButtons = document.createElement('div');
  startButtons.style.marginLeft = '5px';
  startButtons.style.marginTop = '5px';
  tile.appendChild(startButtons);
  const viewButton = document.createElement('button');
  viewButton.classList.add(...Style.Button);
  viewButton.classList.add(...Style.ButtonPrimary);
  viewButton.textContent = 'VIEW';
  startButtons.appendChild(viewButton);
  const validateButton = document.createElement('button');
  validateButton.classList.add(...Style.Button);
  validateButton.classList.add(...Style.ButtonDisabled);
  validateButton.textContent = 'VALIDATE';
  validateButton.disabled = true;
  startButtons.appendChild(validateButton);
  const executeButton = document.createElement('button');
  executeButton.classList.add(...Style.Button);
  executeButton.classList.add(...Style.ButtonDisabled);
  executeButton.textContent = 'EXECUTE';
  executeButton.disabled = true;
  startButtons.appendChild(executeButton);

  // Detect if action needs configuring, then configure
  const packageConfig = { actions: [], groups: [] };
  if (rawActionPackage.actions) {
    let needsConfig = false;
    rawActionPackage.actions.forEach(action => {
      needsConfig = needsConfig || needsConfiguration(action);
    });

    if (needsConfig) {
      createConfigureUI(
        packageConfig,
        tile,
        rawActionPackage,
        validateButton,
        executeButton,
        messageBox,
        0,
      );
    } else {
      validateButton.classList.remove(...Style.ButtonDisabled);
      executeButton.classList.remove(...Style.ButtonDisabled);
      validateButton.classList.add(...Style.ButtonPrimary);
      executeButton.classList.add(...Style.ButtonPrimary);
      validateButton.disabled = false;
      executeButton.disabled = false;
    }
  }

  let executionIndex = 0; // Index of which action is being executed

  // Add action listener for viewing
  viewButton.addEventListener('click', function () {
    addMessage(messageBox, '', true);
    const actionPackage = parseActionPackage(rawActionPackage, packageConfig, messageBox, true);
    [...actionPackage].reverse().forEach(action => {
      addMessage(messageBox, generatePrettyName(action));
    });

    if (actionPackage.length == 0) {
      addMessage(messageBox, 'Error: No actions generated');
    }
  });

  // Add action listener for validation
  validateButton.addEventListener('click', function () {
    addMessage(messageBox, '', true);
    const actionPackage = parseActionPackage(rawActionPackage, packageConfig, messageBox);
    if (actionPackage.valid) {
      validateAction(actionPackage, messageBox);
    }
  });

  // Execute the action!
  executeButton.addEventListener('click', async function () {
    addMessage(messageBox, '', true);
    // Check validation
    const actionPackage = parseActionPackage(rawActionPackage, packageConfig, messageBox);
    const valid = actionPackage.valid && validateAction(actionPackage, messageBox);
    if (!valid) {
      return;
    }

    // Create set of controls/info associated with execution
    const executionInfo = document.createElement('div');
    tile.appendChild(executionInfo);

    // Create area where current action is listed
    const currentActionDiv = document.createElement('div');
    currentActionDiv.style.marginLeft = '5px';
    currentActionDiv.style.marginTop = '5px';
    const currentAction = createTextSpan('Awaiting First Action');
    currentActionDiv.appendChild(currentAction);
    executionInfo.appendChild(currentActionDiv);

    // Create execution controls (this is where the button to click will be moved)
    const executeControls = document.createElement('div');
    executeControls.style.marginLeft = '5px';
    executeControls.style.marginTop = '5px';
    executionInfo.appendChild(executeControls);
    const skipButton = document.createElement('button');
    skipButton.classList.add(...Style.Button);
    skipButton.classList.add(...Style.ButtonPrimary);
    skipButton.textContent = 'SKIP';
    executeControls.appendChild(skipButton);
    const cancelButton = document.createElement('button');
    cancelButton.classList.add(...Style.Button);
    cancelButton.classList.add(...Style.ButtonDanger);
    cancelButton.textContent = 'CANCEL';
    executeControls.appendChild(cancelButton);

    // Begin executing actions
    executionIndex = 0;

    // [{"type": "transferMaterialSet", "buffer": "MTRA", "parameters": {"source": "Base - Antares II - Deimos", "target": "Warehouse - Antares II - Deimos"}}]
    executeAction(
      actionPackage,
      executionIndex,
      messageBox,
      executionInfo,
      tile,
      skipButton,
      cancelButton,
      executeControls,
      currentAction,
    );
  });

  return;
}

async function executeAction(
  actionPackage,
  executionIndex,
  messageBox,
  executionInfo,
  tile,
  skipButton,
  cancelButton,
  executeControls,
  currentAction,
) {
  const action = actionPackage[executionIndex];
  if (!action || !action.type || !action.buffer || !action.parameters) {
    addMessage(messageBox, 'Error: Invalid action format');
    tile.removeChild(executionInfo);
    return;
  }

  const relevantBuffers = getBuffers(action.buffer);

  // Create name for action to show
  const actionName = generatePrettyName(action);
  currentAction.textContent = actionName;

  // Check buffer exists
  if (!relevantBuffers[0]) {
    addMessage(messageBox, 'Error: No buffer found executing: ' + actionName);
    tile.removeChild(executionInfo);
    return;
  }

  const buffer = relevantBuffers[0];

  // Find button to move
  let button;
  let buttonOffset = 0;
  const resetStyles = function (elem) {
    elem.classList.remove('pb-hide-input');
    return elem;
  }; // Function to reset any extra styles on the element besides the ones used in moving it
  switch (action.type) {
    case 'CXBuy': {
      button = buffer.querySelector(Selector.ButtonSuccess);
      buttonOffset = 27;
      break;
    }
    case 'mtraMatSelect': {
      button = buffer.querySelector(Selector.MaterialSelector); // The text box the user must click before the material is auto-selected
      buttonOffset = 2;

      button.classList.add('pb-hide-input');

      // Make fake button to click
      const hiderButton = document.createElement('button');
      executeControls.appendChild(hiderButton);
      hiderButton.textContent = 'CHANGE';

      hiderButton.classList.add(...Style.Button);
      hiderButton.classList.add(...Style.ButtonPrimary);

      break;
    }
    case 'MTRA': {
      button = _$(PrunCss.Button.disabled, buffer) || _$(PrunCss.Button.primary, buffer);
      buttonOffset = -11;
      break;
    }
  }

  if (!button) {
    addMessage(messageBox, 'Error: No button found executing: ' + actionName);
    tile.removeChild(executionInfo);
    return;
  }

  // Move button
  button.style.position = 'fixed';
  button.style.zIndex = '12000';
  buffer.style.isolation = 'auto';
  const rect = cancelButton.getBoundingClientRect();
  button.style.left =
    (rect.left + window.scrollX + button.offsetWidth + buttonOffset).toString() + 'px';
  button.style.top = (rect.top + window.scrollY).toString() + 'px';

  // Fill in fields/modify buffer
  switch (action.type) {
    case 'CXBuy': {
      // Get all the inputs on the buffer and assign them accordingly. There has to be a better way to do this.
      const inputs = buffer.querySelectorAll('input');
      const quantityInput = inputs[0];
      const priceInput = inputs[1];

      if (!quantityInput || !priceInput) {
        undoButtonMove(button, resetStyles, executeControls);
        addMessage(messageBox, 'Error: Missing fields executing: ' + actionName);
        tile.removeChild(executionInfo);
        return;
      }
      if (!action.parameters.amount || !action.parameters.priceLimit) {
        undoButtonMove(button, resetStyles, executeControls);
        addMessage(messageBox, 'Error: Missing parameters executing: ' + actionName);
        tile.removeChild(executionInfo);
        return;
      }
      changeValue(quantityInput, action.parameters.amount.toString());
      changeValue(priceInput, action.parameters.priceLimit.toString());
      break;
    }
    case 'mtraMatSelect': {
      // Get and set relevant inputs on the buffer
      const originSelect = buffer.querySelector(Selector.StoreSelect) as HTMLSelectElement;

      if (!originSelect) {
        undoButtonMove(button, resetStyles, executeControls);
        addMessage(messageBox, 'Error: Missing fields executing: ' + actionName);
        tile.removeChild(executionInfo);
        return;
      }
      if (!action.parameters.origin || !action.parameters.dest) {
        undoButtonMove(button, resetStyles, executeControls);
        addMessage(messageBox, 'Error: Missing parameters executing: ' + actionName);
        tile.removeChild(executionInfo);
        return;
      }

      // Select correct source inventory
      let sourceIndex;
      const sourceMatchText = storageNameToID(action.parameters.origin); // Convert PMMG name for storage into MTRA name for storage
      (Array.from(originSelect.children) as HTMLOptionElement[]).forEach(
        (optionElem, optionIndex) => {
          if (optionElem.textContent && optionElem.textContent.toLowerCase() == sourceMatchText) {
            sourceIndex = optionIndex;
          }
        },
      );

      if (sourceIndex == undefined) {
        // Source not found
        undoButtonMove(button, resetStyles, executeControls);
        addMessage(messageBox, 'Error: Source inventory not found executing: ' + actionName);
        tile.removeChild(executionInfo);
        return;
      }

      // Need to flicker MTRA source in order to update inventory
      // Move to 1st then 2nd item in MTRA list to guarantee change.
      button.disabled = true;
      changeSelectValue(originSelect, 0);
      await sleep(1);
      changeSelectValue(originSelect, 1);
      await sleep(1);

      changeSelectValue(originSelect, sourceIndex); // Change source select

      // Start changing destination select
      const allSelects = buffer.querySelectorAll(Selector.StoreSelect);
      if (!allSelects[1]) {
        undoButtonMove(button, resetStyles, executeControls);
        addMessage(messageBox, 'Error: Destination inventory not found executing: ' + actionName);
        tile.removeChild(executionInfo);
        button.disabled = false;
        return;
      }

      const destSelect = allSelects[1] as HTMLSelectElement; // Select for destination

      // Select correct source inventory
      let destIndex;
      const destMatchTest = storageNameToID(action.parameters.dest); // Convert PMMG name for storage into MTRA name for storage
      (Array.from(destSelect.children) as HTMLOptionElement[]).forEach(
        (optionElem, optionIndex) => {
          if (optionElem.textContent && optionElem.textContent.toLowerCase() == destMatchTest) {
            destIndex = optionIndex;
          }
        },
      );

      if (destIndex == undefined) {
        // Dest not found
        undoButtonMove(button, resetStyles, executeControls);
        addMessage(messageBox, 'Error: Destination inventory not found executing: ' + actionName);
        tile.removeChild(executionInfo);
        button.disabled = false;
        return;
      }

      changeSelectValue(destSelect, destIndex); // Change source select

      await sleep(50);

      // Clear previous material in MTRA
      button.disabled = false;
      button.focus();
      button.value = '';

      const changeEvent = document.createEvent('Event');
      changeEvent.initEvent('change', true, true);

      button.dispatchEvent(changeEvent);

      break;
    }
    case 'MTRA': {
      // Change amount and make transfer
      // Determine how many can be transferred by reading the buffer
      button.disabled = true;
      await sleep(50); // Need to wait for buffer to update
      const sliderNumbers = buffer.querySelectorAll("span[class~='rc-slider-mark-text']");
      let maxAmount = 0;
      sliderNumbers.forEach(sliderNumber => {
        if (sliderNumber.textContent && parseInt(sliderNumber.textContent) > maxAmount) {
          maxAmount = parseInt(sliderNumber.textContent);
        }
      });

      // Make the quantity change
      const changeButton = _$(PrunCss.Button.darkInline, buffer) as HTMLButtonElement; // Change button
      const allInputs = buffer.querySelectorAll('input'); // All the inputs on buffer, next find the "amount" input
      if (!allInputs[1] || !changeButton) {
        undoButtonMove(button, resetStyles, executeControls);
        addMessage(messageBox, 'Error: Missing UI elements');
        tile.removeChild(executionInfo);
        button.disabled = false;
        return;
      }
      const amountInput = allInputs[1]; // Amount input

      if (action.parameters.amount > maxAmount) {
        addMessage(
          messageBox,
          `Warning: ${(action.parameters.amount - maxAmount).toLocaleString()} ${action.parameters.ticker} will not be transferred.`,
        );
      }

      changeValue(amountInput, Math.min(action.parameters.amount, maxAmount)); // Transfer the max amount possible (could add a setting here to error out instead)

      amountInput.focus(); // Need to focus for some reason
      changeButton.focus();

      await sleep(50);

      changeButton.click();
      button.disabled = false;
      break;
    }
  }

  // Add listener to the button to start waiting for feedback. Then move button back and go to next action
  const buttonListener = function () {
    // If a popup is present, don't take any actions
    if (buffer.querySelector(Selector.ActionFeedback)) {
      addMessage(messageBox, 'Error: Popup exists on buffer');
      return;
    }
    // Have to wait for "success" or "failure" screen
    button.disabled = true;
    button.style.cursor = 'not-allowed';

    if (action.type == 'CXBuy') {
      // Add mutation listener to wait for dismiss screen
      monitorStatus(buffer, function (dismissButton) {
        // Detect success
        const success = buffer.querySelector(Selector.ActionSuccess);
        button.disabled = false; // Reenable the button regardless of what happens
        button.style.cursor = 'pointer';

        if (success) {
          // If successful...
          // Put button back to where it was, dismiss success screen
          button.removeEventListener('click', buttonListener);
          skipButton.removeEventListener('click', skipButtonListener);
          cancelButton.removeEventListener('click', cancelButtonListener);
          undoButtonMove(button, resetStyles, executeControls);
          dismissButton.click();
          addMessage(messageBox, 'Successfully executed: ' + actionName);

          // If at end of list, don't repeat
          if (executionIndex + 1 >= actionPackage.length) {
            tile.removeChild(executionInfo);
            addMessage(messageBox, 'Successfully executed action package');
            showSuccessDialog(tile, 'Action Package Successfully Executed!');
          } // Otherwise, increment and repeat
          else {
            executionIndex++;
            executeAction(
              actionPackage,
              executionIndex,
              messageBox,
              executionInfo,
              tile,
              skipButton,
              cancelButton,
              executeControls,
              currentAction,
            );
          }
        } else {
          const feedback =
            buffer.querySelector(Selector.ActionFeedbackMain) ||
            buffer.querySelector(Selector.ActionConfirmationMessage);
          if (!feedback || !feedback.textContent) {
            addMessage(messageBox, 'Error: An error was encountered but could not be read');
          } else {
            addMessage(messageBox, 'Error: ' + feedback.textContent);
          }
        }
      });
    } else if (action.type == 'mtraMatSelect') {
      const matOptions = _$$(PrunCss.MaterialSelector.suggestionEntry, buffer); // MAT options in dropdown
      let matFound = false;
      (Array.from(matOptions) as HTMLElement[]).forEach(matOption => {
        const tickerElem = matOption.firstChild;
        if (!tickerElem) {
          addMessage(messageBox, 'Error: Unable to find ticker element on dropdown');
          return;
        }
        if (action.parameters.ticker.toUpperCase() == tickerElem.textContent) {
          matFound = true;
          matOption.click();
        }
      });

      button.disabled = false; // Reenable the button regardless of what happens
      button.style.cursor = 'pointer';

      // Put everything back in place
      if (matFound) {
        // Put button back to where it was, dismiss success screen
        button.removeEventListener('click', buttonListener);
        skipButton.removeEventListener('click', skipButtonListener);
        cancelButton.removeEventListener('click', cancelButtonListener);
        undoButtonMove(button, resetStyles, executeControls);
        addMessage(messageBox, 'Successfully executed: ' + actionName);

        // If at end of list, don't repeat
        if (executionIndex + 1 >= actionPackage.length) {
          tile.removeChild(executionInfo);
          addMessage(messageBox, 'Successfully executed action package');
          showSuccessDialog(tile, 'Action Package Successfully Executed!');
        } // Otherwise, increment and repeat
        else {
          executionIndex++;
          executeAction(
            actionPackage,
            executionIndex,
            messageBox,
            executionInfo,
            tile,
            skipButton,
            cancelButton,
            executeControls,
            currentAction,
          );
        }
      } else {
        addMessage(messageBox, 'Error: ' + action.parameters.ticker + ' not found in inventory');
      }
    } else if (action.type == 'MTRA') {
      // Add mutation listener to wait for dismiss screen
      monitorStatus(buffer, function (dismissButton) {
        // Detect success
        const success = buffer.querySelector(Selector.ActionSuccess);
        button.disabled = false; // Reenable the button regardless of what happens
        button.style.cursor = 'pointer';

        if (success) {
          // If successful...
          // Put button back to where it was, dismiss success screen
          button.removeEventListener('click', buttonListener);
          skipButton.removeEventListener('click', skipButtonListener);
          cancelButton.removeEventListener('click', cancelButtonListener);
          undoButtonMove(button, resetStyles, executeControls);
          dismissButton.click();
          addMessage(messageBox, 'Successfully executed: ' + actionName);

          // If at end of list, don't repeat
          if (executionIndex + 1 >= actionPackage.length) {
            tile.removeChild(executionInfo);
            addMessage(messageBox, 'Successfully executed action package');
            showSuccessDialog(tile, 'Action Package Successfully Executed!');
          } // Otherwise, increment and repeat
          else {
            executionIndex++;
            executeAction(
              actionPackage,
              executionIndex,
              messageBox,
              executionInfo,
              tile,
              skipButton,
              cancelButton,
              executeControls,
              currentAction,
            );
          }
        } else {
          const feedback =
            buffer.querySelector(Selector.ActionFeedbackMain) ||
            buffer.querySelector(Selector.ActionConfirmationMessage);
          if (!feedback || !feedback.textContent) {
            addMessage(messageBox, 'Error: An error was encountered but could not be read');
          } else {
            addMessage(messageBox, 'Error: ' + feedback.textContent);
          }
        }
      });
    }
  };
  button.removeEventListener('click', buttonListener); // Remove previous listeners
  button.addEventListener('click', buttonListener);

  // Tackle skip button
  const skipButtonListener = function () {
    // Skip the current instruction (putting buttons back where they should be)
    button.removeEventListener('click', buttonListener); // Remove previous listeners
    skipButton.removeEventListener('click', skipButtonListener);
    cancelButton.removeEventListener('click', cancelButtonListener);
    undoButtonMove(button, resetStyles, executeControls);
    addMessage(messageBox, 'Skipped: ' + actionName);

    // If at end of list, don't repeat
    if (executionIndex + 1 >= actionPackage.length) {
      tile.removeChild(executionInfo);
      addMessage(messageBox, 'Successfully executed action package');
      showSuccessDialog(tile, 'Action Package Successfully Executed!');
    } // Otherwise, increment and repeat
    else {
      executionIndex++;
      executeAction(
        actionPackage,
        executionIndex,
        messageBox,
        executionInfo,
        tile,
        skipButton,
        cancelButton,
        executeControls,
        currentAction,
      );
    }
  };
  skipButton.removeEventListener('click', skipButtonListener);
  skipButton.addEventListener('click', skipButtonListener);

  // Tackle cancel button
  const cancelButtonListener = function () {
    // Cancel all instructions (putting buttons back where they should be)
    button.removeEventListener('click', buttonListener); // Remove previous listeners
    skipButton.removeEventListener('click', skipButtonListener);
    cancelButton.removeEventListener('click', cancelButtonListener);
    undoButtonMove(button, resetStyles, executeControls);
    addMessage(messageBox, 'Canceled action package');
    tile.removeChild(executionInfo);
  };
  cancelButton.removeEventListener('click', cancelButtonListener);
  cancelButton.addEventListener('click', cancelButtonListener);
}

function undoButtonMove(button, resetStyles, executeControls) {
  button.style.position = 'relative';
  button.style.left = 'auto';
  button.style.top = 'auto';
  button.style.zIndex = 'auto';
  resetStyles(button);

  if (executeControls.children[2]) {
    executeControls.removeChild(executeControls.children[2]);
  }
}

// Monitor for success/failure in action
function monitorStatus(buffer, callback) {
  const onMutationsObserved = function () {
    const dismiss =
      buffer.querySelector(Selector.ActionDismiss) ||
      buffer.querySelector(Selector.ActionConfirmation);
    if (dismiss) {
      observer.disconnect();
      callback(dismiss);
    }
    return;
  };

  const target = buffer;
  const config = { childList: true, subtree: true };
  const MutationObserver = window['MutationObserver'] || window['WebKitMutationObserver'];
  const observer = new MutationObserver(onMutationsObserved);
  observer.observe(target, config);
}

// Generate a pretty name to be displayed
function generatePrettyName(action) {
  let name = '';

  switch (action.type) {
    case 'CXBuy': {
      const matches = action.buffer.match(/CXPO ([A-Za-z0-9]{1,3})\.([A-Za-z0-9]{3})/);
      if (matches && matches[1] && matches[2]) {
        name =
          'Buy ' +
          action.parameters.amount.toLocaleString(undefined, { maximumFractionDigits: 0 }) +
          ' ' +
          matches[1] +
          ' from ' +
          matches[2] +
          ' for ' +
          action.parameters.priceLimit.toLocaleString(undefined, { maximumFractionDigits: 2 }) +
          '/u';
      }
      break;
    }
    case 'mtraMatSelect': {
      name = 'Change MTRA MAT to ' + action.parameters.ticker;
      break;
    }
    case 'MTRA': {
      const origin =
        action.parameters.origin == 'Configure on Execution'
          ? 'configured location'
          : action.parameters.origin;
      const dest =
        action.parameters.dest == 'Configure on Execution'
          ? 'configured location'
          : action.parameters.dest;

      name =
        'Transfer ' +
        action.parameters.amount.toLocaleString(undefined, { maximumFractionDigits: 0 }) +
        ' ' +
        action.parameters.ticker +
        ' from ' +
        origin +
        ' to ' +
        dest;
      break;
    }
  }

  return name;
}

// Convert storage name from PMMG's style to storage ID
function storageNameToID(name) {
  let match = name.match(/(.*) STL Store/);
  if (match && match[1]) {
    return 'ship ' + match[1].toLowerCase() + ' stl fuel store';
  }
  match = name.match(/(.*) FTL Store/);
  if (match && match[1]) {
    return 'ship ' + match[1].toLowerCase() + ' ftl fuel store';
  }
  match = name.match(/(.*) Cargo/);
  if (match && match[1]) {
    return 'ship ' + match[1].toLowerCase() + ' cargo hold';
  }
  match = name.match(/(.*) Base/);
  if (match && match[1]) {
    return 'base - ' + mtraConvert(match[1]).toLowerCase();
  }
  match = name.match(/(.*) Warehouse/);
  if (match && match[1]) {
    return 'warehouse - ' + mtraConvert(match[1]).toLowerCase();
  }
  return undefined;
}

function mtraConvert(nameOrNaturalId: string) {
  if (Stations[nameOrNaturalId]) {
    // For station warehouses, just return the name of that station
    return nameOrNaturalId.toLowerCase();
  }

  if (nameOrNaturalId.length < 3) {
    return '-';
  }

  // Determine the planets' natural IDs (XX-###x)
  const planet = planetsStore.getByIdOrName(nameOrNaturalId);
  if (!planet) {
    return nameOrNaturalId.toLowerCase();
  }

  const natural = planet?.naturalId ?? nameOrNaturalId;

  // Get system name or ID
  const system = starsStore.getByPlanetNaturalId(natural);
  return (system?.name + ' - ' + nameOrNaturalId).toLowerCase();
}

function addMessage(messageBox, message, clear?) {
  messageBox.textContent = clear
    ? message
    : message + (messageBox.textContent == '' ? '' : '\n') + messageBox.textContent;
}
