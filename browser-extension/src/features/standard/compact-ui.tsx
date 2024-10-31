import { Style, WithStyles } from '@src/Style';
import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { userData } from '@src/store/user-data';
import { $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';

function onBBLTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, PrunCss.SectionList.container), nameElem =>
    clearBuildingLists(tile.anchor, nameElem),
  );
}

function clearBuildingLists(anchor: HTMLElement, nameElem: HTMLElement) {
  if (!anchor.isConnected) {
    return;
  }
  setTimeout(() => clearBuildingLists(anchor, nameElem), 1000);
  const tag = 'rp-compact-ui';
  if (!nameElem.textContent) {
    return;
  }

  for (const row of $$(anchor, PrunCss.SectionList.divider)) {
    if (row.childNodes.length >= 2) {
      continue;
    }
    const newMenu = document.createElement('span');
    const indicator = document.createElement('div');
    const value = document.createElement('div');
    newMenu.classList.add(...WithStyles(Style.RadioButton));
    indicator.classList.add(...WithStyles(Style.RadioButtonToggled));
    value.classList.add(...WithStyles(Style.RadioButtonValue));
    value.innerText = 'Visible';
    row.appendChild(newMenu);
    newMenu.appendChild(indicator);
    newMenu.appendChild(value);
    newMenu.addEventListener('click', () => {
      if (indicator.classList.contains(Style.RadioButtonToggled[1])) {
        if (row.nextElementSibling) hideElement(row.nextElementSibling as HTMLElement, tag);
        indicator.classList.remove(...WithStyles(Style.RadioButtonToggled));
        indicator.classList.add(...WithStyles(Style.RadioButtonUnToggled));
      } else {
        if (row.nextElementSibling) showElement(row.nextElementSibling as HTMLElement, tag);
        indicator.classList.remove(...WithStyles(Style.RadioButtonUnToggled));
        indicator.classList.add(...WithStyles(Style.RadioButtonToggled));
      }
    });
    if (row.innerText.includes('Infrastructure')) {
      const event = new CustomEvent('click', { detail: 'fake click' });
      newMenu.dispatchEvent(event);
    }
  }

  for (const table of Array.from(nameElem.getElementsByTagName('table'))) {
    let repaired = false;

    let establishRow: HTMLTableRowElement | undefined;

    const buttons = table.parentElement!.getElementsByTagName('button');
    buttons[1].classList.remove(...WithStyles(Style.ButtonEnabled));
    buttons[1].classList.add(...WithStyles(Style.ButtonDanger));

    for (const row of Array.from(table.rows)) {
      enum Line {
        Established,
        Repair,
        Cost,
        Refund,
        Value,
        Condition,
      }

      const dict = {
        Established: Line.Established,
        'Last repair': Line.Repair,
        'Repair costs': Line.Cost,
        'Reclaimable materials': Line.Refund,
        'Book value': Line.Value,
        Condition: Line.Condition,
      };

      let lineType = Line.Established;

      for (const data of Array.from(row.getElementsByTagName('td'))) {
        const text = data.innerText;
        if (!text) {
          continue;
        }
        if (dict[text]) {
          lineType = dict[text];
          if (lineType == Line.Established) {
            establishRow = row;
          }
        } else if (text == '--' || text == 'none') {
          hideElement(row, tag);
          continue;
        }

        for (const word of text.split(' ')) {
          const value = parseFloat(word);
          if (isNaN(value)) {
            continue;
          }
          if (lineType == Line.Repair) {
            repaired = true;
          }
          if (
            lineType != Line.Condition &&
            lineType != Line.Established &&
            lineType != Line.Repair
          ) {
            if (lineType == Line.Value && value < 2000) {
              hideElement(row, tag);
            } else if (value <= 1) {
              hideElement(row, tag);
            }
            continue;
          }
          const bar = data.getElementsByTagName('progress');
          if (value > 180) {
            hideElement(row, tag);
            continue;
          }
          if (!bar || bar.length <= 0) {
            const newBar = document.createElement('progress');
            newBar.classList.add(...WithStyles(Style.ProgressBar));
            if (lineType == Line.Condition) {
              newBar.max = 100;
            } else {
              newBar.max = 180;
            }
            data.insertBefore(newBar, data.firstChild);
            continue;
          }
          bar[0].classList.remove(...WithStyles(Style.ProgressBarColors));
          bar[0].value = value;
          if (lineType == Line.Condition) {
            const progress = bar[0].value / bar[0].max;
            if (value > 98 && buttons[0].classList.contains(Style.ButtonEnabled[0])) {
              buttons[0].classList.remove(...WithStyles(Style.ButtonEnabled));
              buttons[0].classList.add(...WithStyles(Style.ButtonDanger));
            }
            if (progress > 0.9) {
              bar[0].classList.add(...WithStyles(Style.ProgressBarGood));
            }
            if (progress > 0.8) {
              bar[0].classList.add(...WithStyles(Style.ProgressBarWarning));
            }
            if (progress > 0) {
              bar[0].classList.add(...WithStyles(Style.ProgressBarDanger));
            }
          } else {
            bar[0].value = 180 - value;
            const progress = bar[0].value / bar[0].max;
            const threshold = userData.settings.repair.threshold / 180.0;
            if (progress > 0.75) {
              bar[0].classList.add(...WithStyles(Style.ProgressBarGood));
            } else if (progress > threshold) {
              bar[0].classList.add(...WithStyles(Style.ProgressBarWarning));
            } else if (progress > 0) {
              bar[0].classList.add(...WithStyles(Style.ProgressBarDanger));
            }
          }
        }
      }

      if (repaired && establishRow) {
        hideElement(establishRow, tag);
      }
    }
  }
}

export function hideElement(element: HTMLElement, tag: string) {
  element.style.display = 'none';
  element.classList.add(`${tag}-hidden`);
}

export function showElement(element: HTMLElement, tag: string) {
  element.style.display = '';
  element.classList.remove(`${tag}-hidden`);
}

export function init() {
  tiles.observe('BBL', onBBLTileReady);
}

void features.add({
  id: 'compact-ui',
  init,
});
