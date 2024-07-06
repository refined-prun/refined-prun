/* eslint-disable @typescript-eslint/no-explicit-any */
import { clearChildren } from '../util';

export class Calculator {
  private tile: HTMLElement;
  public name = 'CALCULATOR';

  constructor(tile) {
    this.tile = tile;
  }

  create_buffer() {
    clearChildren(this.tile);
    const calcDiv = document.createElement('div');
    this.tile.appendChild(calcDiv);
    this.tile.style.display = 'flex';
    this.tile.style.flexDirection = 'row';
    calcDiv.style.maxHeight = '400px';
    const output = document.createElement('input');
    output.classList.add('input-text');
    output.style.fontSize = '20px';
    output.readOnly = true;
    output.style.textAlign = 'right';
    calcDiv.style.display = 'flex';
    calcDiv.style.flexDirection = 'column';
    calcDiv.style.alignItems = 'center';
    calcDiv.style.width = '60%';
    calcDiv.style.minWidth = '180px';

    const historyDiv = document.createElement('div');
    this.tile.appendChild(historyDiv);
    historyDiv.style.width = '35%';
    historyDiv.style.marginTop = '10px';
    historyDiv.style.display = 'block';
    historyDiv.style.maxHeight = '195px';
    historyDiv.style.backgroundColor = 'rgb(35, 40, 43)';
    historyDiv.style.borderColor = 'rgb(43,72,90)';
    historyDiv.style.borderWidth = '1px';
    historyDiv.style.borderStyle = 'solid';
    const historyTable = document.createElement('table');
    historyDiv.appendChild(historyTable);
    const historyTableBody = document.createElement('tbody');
    historyTable.appendChild(historyTableBody);

    output.style.display = 'block';
    output.style.width = '90%';
    output.style.height = '36px';
    output.style.margin = '10px';
    output.style.cursor = 'default';
    calcDiv.appendChild(output);
    let currentString = '';
    let prevValue = null;
    let currentOperation = null as any;
    let clearOnNext = false;
    let doubleClear = false;
    const keypad = document.createElement('div');
    calcDiv.appendChild(keypad);
    keypad.style.width = '95%';
    keypad.style.display = 'grid';
    keypad.style.gridTemplateColumns = 'repeat(4, 1fr)';
    const layout = [
      [7, null],
      [8, null],
      [9, null],
      ['÷', '#3fa2de'],
      [4, null],
      [5, null],
      [6, null],
      ['x', '#3fa2de'],
      [1, null],
      [2, null],
      [3, null],
      ['-', '#3fa2de'],
      [0, null],
      ['.', null],
      ['±', null],
      ['+', '#3fa2de'],
    ];
    layout.forEach(opt => {
      const button = document.createElement('button');
      button.classList.add('refresh-button');
      button.style.fontSize = '20px';
      button.textContent = (opt[0] == 0 ? '0' : opt[0] || '').toString();
      if (opt[1] != null) {
        button.style.backgroundColor = opt[1] as string;
      }
      keypad.appendChild(button);

      button.onclick = function () {
        if (opt[0] == '+' || opt[0] == '-' || opt[0] == 'x' || opt[0] == '÷') {
          if (currentOperation != null) {
            currentString = calculate(prevValue, currentString, currentOperation);
            currentOperation = null;
            prevValue = null;
          }
          currentOperation = opt[0] as any;
          clearOnNext = true;
          output.value = parseFloat(currentString).toLocaleString(undefined, { maximumFractionDigits: 12 });
        } else if (opt[0] == '±') {
          if (currentString.toString().charAt(0) == '-') {
            currentString = currentString.substring(1);
          } else {
            currentString = '-' + currentString;
          }
          output.value = parseFloat(currentString).toLocaleString(undefined, { maximumFractionDigits: 12 });
        } else {
          if (clearOnNext) {
            prevValue = parseFloat(currentString) as any;
            currentString = '';
            clearOnNext = false;
          }
          currentString += (opt[0] == 0 ? '0' : opt[0] || '').toString();
          output.value = parseFloat(currentString).toLocaleString(undefined, { maximumFractionDigits: 12 });
        }
        doubleClear = false;
      };
      return;
    });
    const bottomDiv = document.createElement('div');
    calcDiv.appendChild(bottomDiv);
    bottomDiv.style.width = '95%';
    bottomDiv.style.display = 'grid';
    bottomDiv.style.gridTemplateColumns = 'repeat(2, 1fr)';
    const clear = document.createElement('button');
    bottomDiv.appendChild(clear);
    clear.textContent = 'Clear';
    clear.classList.add('refresh-button');
    clear.style.fontSize = '20px';
    clear.style.backgroundColor = 'rgb(217, 83, 79)';
    clear.onclick = function () {
      currentString = '' as string;
      output.value = currentString;
      currentOperation = null as any;
      prevValue = null as any;
      clearOnNext = false;
      if (doubleClear) {
        clearChildren(historyTableBody);
      }
      doubleClear = true;
    };

    const enter = document.createElement('button');
    enter.onclick = function () {
      if (currentOperation != null) {
        currentString = calculate(prevValue, currentString, currentOperation);
        currentOperation = null;
        prevValue = null;
      }
      output.value = parseFloat(currentString).toLocaleString(undefined, { maximumFractionDigits: 12 });
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.textContent = output.value;
      tr.appendChild(td);
      if (historyTableBody.children.length > 11) {
        historyTableBody.removeChild(historyTableBody.children[historyTableBody.children.length - 1]);
      }
      if (historyTableBody.children.length > 0) {
        historyTableBody.insertBefore(tr, historyTableBody.firstChild);
      } else {
        historyTableBody.appendChild(tr);
      }
      doubleClear = false;
    };
    bottomDiv.appendChild(enter);
    enter.textContent = 'Enter';
    enter.classList.add('refresh-button');
    enter.style.fontSize = '20px';
    enter.style.backgroundColor = '#5cb85c';

    this.tile.addEventListener('keydown', e => {
      if (
        e.key === '1' ||
        e.key === '2' ||
        e.key === '3' ||
        e.key === '4' ||
        e.key === '5' ||
        e.key === '6' ||
        e.key === '7' ||
        e.key === '8' ||
        e.key === '9' ||
        e.key === '0' ||
        e.key === '.'
      ) {
        if (clearOnNext) {
          prevValue = parseFloat(currentString) as any;
          currentString = '';
          clearOnNext = false;
        }
        currentString += e.key;
        output.value = parseFloat(currentString).toLocaleString(undefined, { maximumFractionDigits: 12 });
      } else if (e.key === '+' || e.key === '-' || e.key === 'x' || e.key === '*' || e.key === '/') {
        if (currentOperation != null) {
          currentString = calculate(prevValue, currentString, currentOperation);
          currentOperation = null;
          prevValue = null;
        }
        currentOperation = e.key;
        clearOnNext = true;
        output.value = parseFloat(currentString).toLocaleString(undefined, { maximumFractionDigits: 12 });
      } else if (e.key === 'Enter' || e.key === '=') {
        if (currentOperation != null) {
          currentString = calculate(prevValue, currentString, currentOperation);
          currentOperation = null;
          prevValue = null;
        }
        output.value = parseFloat(currentString).toLocaleString(undefined, { maximumFractionDigits: 12 });
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = output.value;
        tr.appendChild(td);
        if (historyTableBody.children.length > 11) {
          historyTableBody.removeChild(historyTableBody.children[historyTableBody.children.length - 1]);
        }
        if (historyTableBody.children.length > 0) {
          historyTableBody.insertBefore(tr, historyTableBody.firstChild);
        } else {
          historyTableBody.appendChild(tr);
        }
        doubleClear = false;
      } else if (e.key === 'Escape') {
        currentString = '';
        output.value = currentString;
        currentOperation = null;
        prevValue = null;
        clearOnNext = false;
        if (doubleClear) {
          clearChildren(historyTableBody);
        }
        doubleClear = true;
      } else if (e.key === 'Backspace') {
        if (currentString.length > 0) {
          currentString = currentString.slice(0, -1);
          output.value = parseFloat(currentString).toLocaleString(undefined, { maximumFractionDigits: 12 });
        }
      }
    });

    return;
  }

  update_buffer() {
    // Nothing to update
  }

  destroy_buffer() {
    // Nothing constantly running so nothing to destroy
  }
}

function calculate(prevValue, currentString, currentOperation) {
  currentString = parseFloat(currentString);
  if (currentOperation == '+') {
    return prevValue + currentString;
  } else if (currentOperation == '-') {
    return prevValue - currentString;
  } else if (currentOperation == 'x' || currentOperation == '*') {
    return prevValue * currentString;
  } else if (currentOperation == '÷' || currentOperation == '/') {
    return prevValue / currentString;
  } else {
    return 0;
  }
}
