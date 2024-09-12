import { getBuffersFromList, getBuffers } from '@src/util';
import { Selector } from '@src/Selector';

export function validateAction(actionPackage, messageBox) {
  if (actionPackage.length == 0) {
    addMessage(messageBox, 'Error: No actions generated');
    return false;
  }
  // Gets all buffers
  const bufferDivs = getBuffers('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffers = [] as any[];
  bufferDivs.forEach(buffer => {
    const header = buffer.querySelector(Selector.BufferHeader);
    if (!header) {
      return;
    }

    const parameters = header.textContent;

    buffers.push([parameters, buffer]);
  });
  let valid = true;
  actionPackage.forEach(action => {
    if (!action.type) {
      valid = false;
      addMessage(messageBox, 'Error: Action Type Missing');
    }
    if (!action.buffer) {
      valid = false;
      addMessage(messageBox, 'Error: Buffer Not Specified');
    } else {
      const matchingBuffers = getBuffersFromList(action.buffer, buffers);
      if (matchingBuffers.length == 0) {
        valid = false;
        addMessage(messageBox, 'Error: Missing Buffer ' + action.buffer);
      }
    }

    switch (action.type) {
      case 'CXBuy':
        if (!action.parameters || !action.parameters.amount || !action.parameters.priceLimit) {
          valid = false;
          addMessage(messageBox, 'Error: Missing parameters on ' + action.buffer);
        }
        break;
      case 'mtraMatSelect':
        if (
          !action.parameters ||
          !action.parameters.origin ||
          !action.parameters.dest ||
          !action.parameters.ticker ||
          !action.parameters.amount
        ) {
          valid = false;
          addMessage(messageBox, 'Error: Missing parameters on ' + action.buffer);
        } else if (action.parameters.amount && action.parameters.amount % 1 != 0) {
          valid = false;
          addMessage(
            messageBox,
            'Error: Non-integer amounts transferring ' + action.parameters.ticker,
          );
        } else if (action.parameters.amount && action.parameters.amount <= 0) {
          valid = false;
          addMessage(
            messageBox,
            'Error: Non-positive amounts transferring ' + action.parameters.ticker,
          );
        }
        break;
      case 'MTRA':
        if (!action.parameters || !action.parameters.amount) {
          valid = false;
          addMessage(messageBox, 'Error: Missing parameters on ' + action.buffer);
        } else if (action.parameters.amount && action.parameters.amount <= 0) {
          valid = false;
          addMessage(
            messageBox,
            'Error: Non-positive amounts transferring ' + action.parameters.ticker,
          );
        }
        break;
      default:
        valid = false;
        addMessage(messageBox, 'Error: Unrecognized action type');
    }
  });

  if (valid) {
    addMessage(messageBox, 'Successfully validated');
  }

  return valid;
}

function addMessage(messageBox, message, clear?) {
  messageBox.textContent = clear
    ? message
    : message + (messageBox.textContent == '' ? '' : '\n') + messageBox.textContent;
}
