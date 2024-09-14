import { Style, WithStyles } from '@src/Style';
import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import { _$, _$$ } from '@src/utils/get-element-by-class-name';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { refAnimationFrame, refInnerText, refValue } from '@src/utils/reactive-dom';
import { computed, watch } from 'vue';
import onElementDisconnected from '@src/utils/on-element-disconnected';
import descendantPresent from '@src/utils/descendant-present';
import {
  observeReadyElementsByClassName,
  observeReadyElementsByTagName,
} from '@src/utils/mutation-observer';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { settings } from '@src/store/settings';
import { exchangeStore } from '@src/infrastructure/prun-api/data/exchanges';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';

function onBBLTileReady(tile: PrunTile) {
  clearBuildingLists(tile.frame);
}

export function clearBuildingLists(tile: HTMLDivElement) {
  if (!tile.isConnected) {
    return;
  }
  setTimeout(() => clearBuildingLists(tile), 1000);
  const tag = 'rp-compact-ui';
  const nameElem = _$(PrunCss.SectionList.container, tile);
  if (!nameElem || !nameElem.textContent) {
    return;
  }

  for (const row of _$$(PrunCss.SectionList.divider, tile) as HTMLElement[]) {
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
            const threshold = settings.repairThreshold / 180.0;
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
  observeReadyElementsByClassName(PrunCss.Link.link, {
    baseElement: tile.frame,
    callback: link => {
      const exchange = exchangeStore.getByName(link.textContent);
      const naturalId = getEntityNaturalIdFromAddress(exchange?.address);
      if (naturalId) {
        link.textContent = naturalId;
      }
    },
  });

  observeReadyElementsByTagName('th', {
    baseElement: tile.frame,
    callback: header => {
      if (header.textContent == 'Exchange') {
        header.textContent = 'Exc.';
      }
    },
  });
}

async function onBSTileReady(tile: PrunTile) {
  // Only process BS {base} tiles
  if (!tile.parameter) {
    return;
  }

  await descendantPresent(tile.frame, PrunCss.Site.container);

  processBSAreaProgressBar(tile);

  observeReadyElementsByTagName('th', {
    baseElement: tile.frame,
    callback: x => (x.innerText = x.innerText.replace('Current Workforce', 'Current')),
  });

  observeReadyElementsByTagName('tr', {
    baseElement: tile.frame,
    callback: x => onWorkforceTableRowReady(tile, x),
  });
}

function onWorkforceTableRowReady(tile: PrunTile, row: HTMLTableRowElement) {
  const cells = row.getElementsByTagName('td');
  if (cells.length === 0) {
    return;
  }

  const levelText = refInnerText(cells[0]);
  const shouldHideRow = computed(() => {
    const level = levelText.value.substring(0, 3).toLowerCase();
    const site = sitesStore.getByPlanetNaturalId(tile.parameter);
    const workforce = workforcesStore
      .getById(site?.siteId)
      ?.workforces.find(x => x.level.toLowerCase().startsWith(level));
    return (
      workforce && workforce.capacity < 1 && workforce.required < 1 && workforce.population < 1
    );
  });
  onElementDisconnected(
    row,
    watch(shouldHideRow, x => (row.style.display = x ? 'none' : ''), { immediate: true }),
  );

  const bar = cells[4].getElementsByTagName('div')[0];
  bar.style.display = 'flex';
  bar.style.flexDirection = 'row';
  bar.style.justifyContent = 'left';
  const progress = bar.getElementsByTagName('progress')[0];
  const progressTitle = refAnimationFrame(progress, x => x.title);
  const progressText = document.createElement('span');
  bar.appendChild(progressText);
  onElementDisconnected(
    progress,
    watch(progressTitle, x => (progressText.textContent = x), { immediate: true }),
  );
}

function processBSAreaProgressBar(tile: PrunTile) {
  const elements = _$$(PrunCss.FormComponent.containerPassive, tile.frame) as HTMLElement[];
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
  onElementDisconnected(
    areaBar,
    watch(refValue(areaBar), x => (areaBarCopy.value = x), { immediate: true }),
  );
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
