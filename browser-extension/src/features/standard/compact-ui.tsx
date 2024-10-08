import { Style, WithStyles } from '@src/Style';
import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { refAnimationFrame, refValue } from '@src/utils/reactive-dom';
import { computed } from 'vue';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { exchangeStore } from '@src/infrastructure/prun-api/data/exchanges';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { userData } from '@src/store/user-data';
import { watchEffectWhileNodeAlive } from '@src/utils/watch-effect-while-node-alive';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { $$, _$$ } from '@src/utils/select-dom';
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

function onCXOSTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, PrunCss.Link.link), link => {
    const exchange = exchangeStore.getByName(link.textContent);
    const naturalId = getEntityNaturalIdFromAddress(exchange?.address);
    if (naturalId) {
      link.textContent = naturalId;
    }
  });

  subscribe($$(tile.anchor, 'th'), header => {
    if (header.textContent == 'Exchange') {
      header.textContent = 'Exc.';
    }
  });
}

async function onBSTileReady(tile: PrunTile) {
  // Only process BS {base} tiles
  if (!tile.parameter) {
    return;
  }

  subscribe($$(tile.anchor, PrunCss.Site.container), () => {
    processBSAreaProgressBar(tile);

    subscribe($$(tile.anchor, 'th'), header => {
      header.innerText = header.innerText.replace('Current Workforce', 'Current');
    });

    subscribe($$(tile.anchor, 'tr'), row => {
      onWorkforceTableRowReady(row, tile.parameter);
    });
  });
}

function onWorkforceTableRowReady(row: HTMLTableRowElement, siteId: string | undefined) {
  const cells = row.getElementsByTagName('td');
  if (cells.length === 0) {
    return;
  }

  const levelId = refPrunId(row);
  const shouldHideRow = computed(() => {
    const site = sitesStore.getByPlanetNaturalId(siteId);
    const workforce = workforcesStore
      .getById(site?.siteId)
      ?.workforces.find(x => x.level === levelId.value);
    return (
      workforce && workforce.capacity < 1 && workforce.required < 1 && workforce.population < 1
    );
  });
  watchEffectWhileNodeAlive(row, () => (row.style.display = shouldHideRow.value ? 'none' : ''));

  const bar = cells[4].getElementsByTagName('div')[0];
  bar.style.display = 'flex';
  bar.style.flexDirection = 'row';
  bar.style.justifyContent = 'left';
  const progress = bar.getElementsByTagName('progress')[0];
  const progressTitle = refAnimationFrame(progress, x => x.title);
  const progressText = document.createElement('span');
  bar.appendChild(progressText);
  watchEffectWhileNodeAlive(progress, () => (progressText.textContent = progressTitle.value));
}

function processBSAreaProgressBar(tile: PrunTile) {
  const elements = _$$(tile.anchor, PrunCss.FormComponent.containerPassive);
  if (elements.length < 2) {
    return;
  }

  const areaRow = elements[0];
  areaRow.style.display = 'none';
  const areaBar = areaRow.getElementsByTagName('progress')[0];
  if (!areaBar) {
    return;
  }

  const areaBarCopy = areaBar.cloneNode(true) as HTMLProgressElement;
  const areaValue = refValue(areaBar);
  watchEffectWhileNodeAlive(areaBar, () => (areaBarCopy.value = areaValue.value));
  const editDiv = elements[1].getElementsByTagName('div')[0] as HTMLElement;
  editDiv.insertBefore(areaBarCopy, editDiv.lastChild);
}

export function init() {
  tiles.observe('BBL', onBBLTileReady);
  tiles.observe('CXOS', onCXOSTileReady);
  tiles.observe('BS', onBSTileReady);
}

void features.add({
  id: 'compact-ui',
  init,
});
