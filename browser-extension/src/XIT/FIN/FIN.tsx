import {
  clearChildren,
  createSelectOption,
  createSmallButton,
  createTable,
  createTextSpan,
  createToolTip,
  dateYearFormatter,
  downloadFile,
  hourFormatter,
  setSettings,
  showWarningDialog,
} from '@src/util';
import { Style } from '@src/Style';
import system from '@src/system';
import xit from '../xit-registry';
import { cxStore } from '@src/fio/cx';
import { recordFinancials, interpretCX, calculateFinancials, finHistory } from '@src/financials';
import features from '@src/feature-registry';
import { widgetAppend } from '@src/utils/vue-mount';
import SUMMARY from './SUMMARY.vue';
import PROD from './PROD.vue';
import CHARTS from '@src/XIT/FIN/CHARTS.vue';
import EquityHistoryChart from '@src/XIT/FIN/EquityHistoryChart.vue';
import AssetPieChart from '@src/XIT/FIN/AssetPieChart.vue';
import LocationsPieChart from '@src/XIT/FIN/LocationsPieChart.vue';

class Finances {
  private tile: HTMLElement;
  private parameters: string[];
  private pmmgSettings;

  constructor(tile, parameters, pmmgSettings) {
    this.tile = tile;
    this.parameters = parameters;
    this.pmmgSettings = pmmgSettings;
  }

  create_buffer() {
    clearChildren(this.tile);
    chooseScreen(this.tile, this.parameters, this.pmmgSettings, this);
  }
}

// Draw the correct screen based on the parameters (should split out into multiple functions probably)
function chooseScreen(tile, parameters, pmmgSettings, finObj) {
  let i;

  // Determine the array of CX prices to use
  let CX = 'AI1';
  if (pmmgSettings['PMMGExtended']['pricing_scheme']) {
    const interpreted = interpretCX(pmmgSettings['PMMGExtended']['pricing_scheme']);
    CX = interpreted[0];
  }

  if (!cxStore.prices || !cxStore.prices[CX]) {
    setTimeout(() => chooseScreen(tile, parameters, pmmgSettings, finObj), 50);
    return;
  }

  let finResult = {
    ...calculateFinancials(),
    History: finHistory,
  };

  // Create settings screen
  if (
    parameters[1] &&
    (parameters[1].toLowerCase() == 'settings' || parameters[1].toLowerCase() == 'set')
  ) {
    // Create option for choosing pricing
    const pricingHeader = document.createElement('h3');
    pricingHeader.appendChild(document.createTextNode('Pricing Scheme'));
    pricingHeader.appendChild(
      createToolTip('Select a pricing scheme to calculate financials.', 'right'),
    );
    pricingHeader.classList.add(...Style.SidebarSectionHead);
    tile.appendChild(pricingHeader);

    const priceDiv = document.createElement('div');
    tile.appendChild(priceDiv);

    const priceLabel = createTextSpan('Pricing Scheme:');
    priceLabel.style.marginBottom = '4px';
    priceDiv.appendChild(priceLabel);

    const priceSelect = document.createElement('select');

    priceSelect.name = 'price-select';
    priceSelect.id = 'price-select';

    // Add each CX option
    for (const name of Object.keys(PricingSchemes)) {
      priceSelect.appendChild(createSelectOption(name, name));
    }

    // Set value to what is in settings
    if (
      !pmmgSettings['PMMGExtended']['pricing_scheme'] ||
      !PricingSchemes[pmmgSettings['PMMGExtended']['pricing_scheme']]
    ) {
      (priceSelect.children[0] as HTMLOptionElement).selected = true;
    } else if (PricingSchemes[pmmgSettings['PMMGExtended']['pricing_scheme']]) {
      (
        priceSelect.children[
          PricingSchemes[pmmgSettings['PMMGExtended']['pricing_scheme']]
        ] as HTMLOptionElement
      ).selected = true;
    }

    priceSelect.classList.add('select');
    priceSelect.style.marginLeft = '4px';

    // Detect if changed to custom spreadsheet. Show or hide div accordingly
    priceSelect.addEventListener('change', () => {
      pmmgSettings['PMMGExtended']['pricing_scheme'] = priceSelect.selectedOptions[0].value;
      setSettings(pmmgSettings);
    });

    priceDiv.appendChild(priceSelect);

    // Create option to import/export data
    const importHeader = document.createElement('h3');
    importHeader.appendChild(document.createTextNode('Import/Export Data'));
    importHeader.appendChild(
      createToolTip('Import or export financial data to a json file.', 'right'),
    );
    importHeader.classList.add(...Style.SidebarSectionHead);
    tile.appendChild(importHeader);

    const importDiv = document.createElement('div');
    tile.appendChild(importDiv);

    const importButton = document.createElement('button');
    importButton.textContent = 'Import Finances';
    importButton.classList.add(...Style.Button);
    importButton.classList.add(...Style.ButtonPrimary);
    importButton.style.marginLeft = '4px';
    importButton.style.marginBottom = '4px';
    importDiv.appendChild(importButton);

    const importFile = document.createElement('input');
    importFile.type = 'file';
    importFile.accept = '.json';
    importFile.style.display = 'none';
    importDiv.appendChild(importFile);

    const errorTextBox = createTextSpan('Error Loading File!');
    errorTextBox.style.display = 'none';
    importDiv.appendChild(errorTextBox);

    // When import button is clicked, click invisible file object
    importButton.addEventListener('click', () => {
      importFile.click();
      return;
    });

    // When imported file is detected, parse and import the data
    importFile.addEventListener('change', function () {
      if (!this.files) {
        return;
      }
      const file = this.files[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        if (!e || !e.target) {
          return;
        }
        try {
          const fileOutput = JSON.parse(e.target.result as string);
          finResult = { ...fileOutput };

          setSettings({ 'PMMG-Finance': finResult });
          errorTextBox.style.display = 'none';
        } catch {
          console.log('PMMG: Error encountered processing file!');
          errorTextBox.style.display = 'inline-block';
        }
      };
      reader.readAsText(file);
    });

    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Finances';
    exportButton.classList.add(...Style.Button);
    exportButton.classList.add(...Style.ButtonPrimary);
    exportButton.style.marginLeft = '4px';
    exportButton.style.marginBottom = '4px';
    importDiv.appendChild(exportButton);

    // When export button is pressed, download data
    exportButton.addEventListener('click', () => {
      const output = {};
      for (const key of Object.keys(finResult)) {
        output[key] = finResult[key];
      }

      downloadFile(output, `pmmg-finance${Date.now().toString()}.json`);
    });

    // Create option to manually trigger collection
    const collectHeader = document.createElement('h3');
    collectHeader.appendChild(document.createTextNode('Collect Data'));
    collectHeader.appendChild(createToolTip('Manually collects a data point.', 'right'));
    collectHeader.classList.add(...Style.SidebarSectionHead);
    tile.appendChild(collectHeader);

    const addButton = document.createElement('button');
    addButton.textContent = 'Record Data';
    addButton.classList.add(...Style.Button);
    addButton.classList.add(...Style.ButtonPrimary);
    addButton.style.marginLeft = '4px';
    addButton.style.marginBottom = '4px';
    tile.appendChild(addButton);

    addButton.addEventListener('click', () => {
      recordFinancials(pmmgSettings);
      finObj.create_buffer();
    });

    // Create option to purge individual data points
    const purgeHeader = document.createElement('h3');
    purgeHeader.appendChild(document.createTextNode('Purge Specific Data Points'));
    purgeHeader.appendChild(createToolTip('Purge individual data points from storage.', 'right'));
    purgeHeader.classList.add(...Style.SidebarSectionHead);
    tile.appendChild(purgeHeader);

    const tbody = createTable(tile, ['Date', 'Equity', 'Delete']);

    for (i = 0; i < finHistory.length; i++) {
      const item = finHistory[i];
      const row = document.createElement('tr');
      tbody.appendChild(row);

      const dateColumn = document.createElement('td');
      dateColumn.appendChild(
        createTextSpan(
          `${hourFormatter.format(new Date(item[0]))} on ${dateYearFormatter.format(
            new Date(item[0]),
          )}`,
        ),
      );
      row.appendChild(dateColumn);

      const equityColumn = document.createElement('td');
      const equity = item[1] + item[2] + item[3] - item[4];
      equityColumn.appendChild(
        createTextSpan(equity.toLocaleString(undefined, { maximumFractionDigits: 0 })),
      );
      row.appendChild(equityColumn);

      const deleteColumn = document.createElement('td');
      deleteColumn.appendChild(
        createSmallButton(
          'delete',
          index => {
            showWarningDialog(
              tile,
              'Are you sure you want to delete this datapoint?',
              'Confirm',
              () => {
                // That's a lot of nested stuff...

                finHistory.splice(index, 1);
                setSettings({ 'PMMG-Finance': finResult });
                finObj.create_buffer();
              },
            );
          },
          [i],
        ),
      );
      row.appendChild(deleteColumn);
    }

    // Create option for clearing data
    const clearHeader = document.createElement('h3');
    clearHeader.appendChild(document.createTextNode('Clear All Data'));
    clearHeader.appendChild(
      createToolTip('Clear all current and historical financial data.', 'right'),
    );
    clearHeader.classList.add(...Style.SidebarSectionHead);
    tile.appendChild(clearHeader);

    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear Data';
    clearButton.classList.add(...Style.Button);
    clearButton.classList.add(...Style.ButtonPrimary);
    clearButton.style.marginLeft = '4px';
    clearButton.style.marginBottom = '4px';
    tile.appendChild(clearButton);

    clearButton.addEventListener('click', () => {
      showWarningDialog(
        tile,
        'You are about to clear all current and historical financial data. Do you want to continue?',
        'Confirm',
        clearData,
        pmmgSettings,
      );
    });
    return;
  }

  if (!finResult || Object.keys(finResult).length == 0) {
    // No data recorded
    const header = document.createElement('h3');
    header.textContent =
      'No data has been recorded yet. Wait a few seconds then refresh the page. If this persists, contact PiBoy314.';
    header.style.textAlign = 'center';
    header.style.width = '100%';
    tile.appendChild(header);
    return;
  }

  if (
    !parameters[1] ||
    parameters[1].toLowerCase() == 'summary' ||
    parameters[1].toLowerCase() == 'sum'
  ) {
    widgetAppend(tile, SUMMARY);
  } else if (parameters[1].toLowerCase() == 'chart' || parameters[1].toLowerCase() == 'charts') {
    // Some charts summarizing finances
    if (parameters[2]) {
      const graphDiv = document.createElement('div');
      graphDiv.style.margin = '5px';
      tile.appendChild(graphDiv);
      const type = parameters[2].toLowerCase();
      if (type === 'history') {
        widgetAppend(graphDiv, EquityHistoryChart);
      } else if (type === 'assetpie') {
        widgetAppend(graphDiv, AssetPieChart);
      } else if (type === 'locationspie') {
        widgetAppend(graphDiv, LocationsPieChart);
      } else {
        graphDiv.appendChild(createTextSpan('Error! Not a valid graph type!'));
        return;
      }
    }
    if (finHistory.length == 0) {
      return;
    }

    widgetAppend(tile, CHARTS);
  } else if (parameters[1].toLowerCase() == 'production' || parameters[1].toLowerCase() == 'prod') {
    widgetAppend(tile, PROD);
  }
}

function clearData(result) {
  if (result['PMMGExtended']) {
    result['PMMGExtended']['last_fin_recording'] = undefined;
    setSettings(result);
  }
  system.storage.local.remove('PMMG-Finance');
}

const PricingSchemes = {
  'AI1 AVG': 0,
  'AI1 ASK': 1,
  'AI1 BID': 2,
  'CI1 AVG': 3,
  'CI1 ASK': 4,
  'CI1 BID': 5,
  'CI2 AVG': 6,
  'CI2 ASK': 7,
  'CI2 BID': 8,
  'IC1 AVG': 9,
  'IC1 ASK': 10,
  'IC1 BID': 11,
  'NC1 AVG': 12,
  'NC1 ASK': 13,
  'NC1 BID': 14,
  'NC2 AVG': 15,
  'NC2 ASK': 16,
  'NC2 BID': 17,
};

function init() {
  xit.add({
    command: ['FIN', 'FINANCE', 'FINANCES'],
    name: 'FINANCES',
    module: Finances,
  });
}

features.add({
  id: 'xit-fin',
  init,
});
