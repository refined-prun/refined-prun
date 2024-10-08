import { getBuffersFromList, getBuffers } from '@src/util';
import { Selector } from '@src/Selector';
import { addMessage } from './Execute';

export function validateAction(actionPackage, messageBox) {
  if (actionPackage.length == 0) {
    addMessage(messageBox, 'No actions generated', 'ERROR');
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
      addMessage(messageBox, 'Action Type Missing', 'ERROR');
    }
    if (!action.buffer) {
      valid = false;
      addMessage(messageBox, 'Buffer Not Specified', 'ERROR');
    } else {
      const matchingBuffers = getBuffersFromList(action.buffer, buffers);
      if (matchingBuffers.length == 0) {
        valid = false;
        addMessage(messageBox, 'Missing Buffer ' + action.buffer, 'ERROR');
      }
    }

    switch (action.type) {
      case 'CXBuy':
        if (!action.parameters || !action.parameters.amount || !action.parameters.priceLimit) {
          valid = false;
          addMessage(messageBox, 'Missing parameters on ' + action.buffer, 'ERROR');
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
          addMessage(messageBox, 'Missing parameters on ' + action.buffer, 'ERROR');
        } else if (action.parameters.amount && action.parameters.amount % 1 != 0) {
          valid = false;
          addMessage(
            messageBox,
            'Non-integer amounts transferring ' + action.parameters.ticker,
            'ERROR',
          );
        } else if (action.parameters.amount && action.parameters.amount <= 0) {
          valid = false;
          addMessage(
            messageBox,
            'Non-positive amounts transferring ' + action.parameters.ticker,
            'ERROR',
          );
        }
        break;
      case 'MTRA':
        if (!action.parameters || !action.parameters.amount) {
          valid = false;
          addMessage(messageBox, 'Missing parameters on ' + action.buffer, 'ERROR');
        } else if (action.parameters.amount && action.parameters.amount <= 0) {
          valid = false;
          addMessage(
            messageBox,
            'Non-positive amounts transferring ' + action.parameters.ticker,
            'ERROR',
          );
        }
        break;
      default:
        valid = false;
        addMessage(messageBox, 'Unrecognized action type', 'ERROR');
    }
  });

  if (valid) {
    addMessage(messageBox, 'Successfully validated', 'SUCCESS');
  }

  return valid;
}
