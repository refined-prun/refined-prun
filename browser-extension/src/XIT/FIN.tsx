/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  clearChildren,
  createFinancialTextBox,
  createSelectOption,
  createSmallButton,
  createTable,
  createTextSpan,
  createToolTip,
  dateYearFormatter,
  downloadFile,
  getLocalStorage,
  hourFormatter,
  setSettings,
  showBuffer,
  showWarningDialog,
} from '../util';
import { Style, TextColors } from '../Style';
import { CurrencySymbols } from '../GameProperties';
import system from '@src/system';
import xit from './xit-registry';
import { cxStore } from '@src/fio/cx';
import { recordFinancials, FinancialSnapshot, getPrice, interpretCX } from '@src/financials';
import features from '@src/feature-registry';
import { widgetAppend } from '@src/utils/vue-mount';
import EquityHistoryChart from '@src/XIT/FIN/EquityHistoryChart.vue';
import PieChart from '@src/XIT/FIN/PieChart.vue';
import { workforcesStore } from '@src/prun-api/data/workforces';
import { getPlanetNameFromAddress } from '@src/prun-api/data/addresses';
import { productionStore } from '@src/prun-api/data/production';
import { sitesStore } from '@src/prun-api/data/sites';
import SUMMARY from '@src/XIT/FIN/SUMMARY.vue';

class Finances {
  private tile: HTMLElement;
  private parameters: string[];
  private pmmgSettings;

  public name = 'FINANCES';

  constructor(tile, parameters, pmmgSettings) {
    this.tile = tile;
    this.parameters = parameters;
    this.pmmgSettings = pmmgSettings;
  }

  create_buffer() {
    clearChildren(this.tile);
    if (this.pmmgSettings['PMMGExtended']['recording_financials'] == false) {
      // If not recording financial info, show screen with checkbox to enable
      // Create a header explaining the situation
      const header = document.createElement('h3');
      header.textContent =
        'You are not recording daily financial data, would you like to enable recording?';
      header.style.textAlign = 'center';
      header.style.width = '100%';
      this.tile.appendChild(header);

      // Div holding the checkbox
      const checkboxDiv = document.createElement('div');
      checkboxDiv.style.alignItems = 'center';
      checkboxDiv.style.display = 'flex';
      checkboxDiv.style.justifyContent = 'center';
      checkboxDiv.style.paddingBottom = '5px';
      this.tile.appendChild(checkboxDiv);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.style.display = 'inline-block';
      checkboxDiv.appendChild(checkbox);

      const label = document.createElement('div');
      label.textContent = 'Enable Recording (Refresh needed to take effect)';
      label.style.display = 'inline-block';
      label.style.marginTop = '2px';
      checkboxDiv.appendChild(label);

      const explainDiv = document.createElement('div');
      explainDiv.style.padding = '5px';
      this.tile.appendChild(explainDiv);
      explainDiv.appendChild(
        createTextSpan(
          'PMMG can record your finances (using FIO data) to provide a more accurate estimate than the in-game FIN screen. The data is pulled at most every 24 hours and is stored locally like your other settings. You can access all the information from the XIT FIN buffer.',
        ),
      );

      // Declare class parameters in static context
      const pmmgSettings = this.pmmgSettings;

      // Flip the settings when checkbox is checked
      checkbox.addEventListener('click', () => {
        pmmgSettings['PMMGExtended']['recording_financials'] = checkbox.checked;
        setSettings(pmmgSettings);
      });

      return;
    }

    // Get stored financial data
    getLocalStorage('PMMG-Finance', chooseScreen, [
      this.tile,
      this.parameters,
      this.pmmgSettings,
      this,
    ]);
    return;
  }

  update_buffer() {
    // Nothing to update
  }

  destroy_buffer() {
    // Nothing constantly running so nothing to destroy
  }
}

// Draw the correct screen based on the parameters (should split out into multiple functions probably)
function chooseScreen(finResult, params) {
  let i;
  finResult = finResult['PMMG-Finance'] as FinancialSnapshot;
  if (!params[0] || !params[1] || !params[2]) {
    return;
  }
  const tile = params[0];
  const parameters = params[1];
  const pmmgSettings = params[2];
  const finObj = params[3];

  // Determine the array of CX prices to use
  let CX = 'AI1';
  let priceType = 'Average';
  if (pmmgSettings['PMMGExtended']['pricing_scheme']) {
    const interpreted = interpretCX(pmmgSettings['PMMGExtended']['pricing_scheme']);
    CX = interpreted[0];
    priceType = interpreted[1];
  }

  if (!cxStore.prices || !cxStore.prices[CX]) {
    return;
  }
  const cxPrices = cxStore.prices[CX]![priceType]; // Dictionary containing prices keyed to material tickers

  let currency = ''; // Determine currency symbol
  switch (CX) {
    case 'AI1':
      currency = CurrencySymbols.AIC;
      break;
    case 'CI1':
    case 'CI2':
      currency = CurrencySymbols.CIS;
      break;
    case 'NC1':
    case 'NC2':
      currency = CurrencySymbols.NCC;
      break;
    case 'IC1':
      currency = CurrencySymbols.ICA;
      break;
  }

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
          finResult = {};
          for (const key of Object.keys(fileOutput)) {
            finResult[key] = fileOutput[key];
          }

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

    for (i = 0; i < finResult.History.length; i++) {
      const row = document.createElement('tr');
      tbody.appendChild(row);

      const dateColumn = document.createElement('td');
      dateColumn.appendChild(
        createTextSpan(
          `${hourFormatter.format(new Date(finResult.History[i][0]))} on ${dateYearFormatter.format(
            new Date(finResult.History[i][0]),
          )}`,
        ),
      );
      row.appendChild(dateColumn);

      const equityColumn = document.createElement('td');
      const equity =
        finResult.History[i][1] +
        finResult.History[i][2] +
        finResult.History[i][3] -
        finResult.History[i][4];
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

                finResult.History.splice(index, 1);
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

  const locations = {}; // Extract info on locations and their total value
  for (const inv of finResult.Buildings) {
    if (locations[inv[0]]) {
      locations[inv[0]][0] += inv[1];
      locations[inv[0]][2] += inv[1];
    } else {
      locations[inv[0]] = [inv[1], 0, inv[1]];
    }
  }

  for (const inv of finResult.Buildings) {
    if (locations[inv[0]]) {
      locations[inv[0]][1] += inv[1];
      locations[inv[0]][2] += inv[1];
    } else {
      locations[inv[0]] = [0, inv[1], inv[1]];
    }
  }

  const locationsArray = [] as any[]; // Rework into common array different screens use
  for (const inv of Object.keys(locations)) {
    locationsArray.push([inv, locations[inv][0], locations[inv][1], locations[inv][2]]);
  }
  locationsArray.sort(financialSort);

  if (!parameters[1]) {
    // Base finances screen
    const quickHeader = document.createElement('h3');
    quickHeader.appendChild(document.createTextNode('Quick Links'));
    quickHeader.classList.add(...Style.SidebarSectionHead);
    tile.appendChild(quickHeader);

    const quickDiv = document.createElement('div');
    quickDiv.style.marginLeft = '5px';
    tile.appendChild(quickDiv);

    const quickButtons = [
      ['SUMMARY', 'SUMMARY'],
      ['PRODUCTION', 'PRODUCTION'],
      ['CHARTS', 'CHART'],
      ['SETTINGS', 'SETTINGS'],
    ];
    for (const label of quickButtons) {
      const button = document.createElement('button');
      button.classList.add(...Style.Button);
      button.classList.add(...Style.ButtonPrimary);
      button.style.marginBottom = '5px';
      button.textContent = label[0];
      quickDiv.appendChild(button);
      button.addEventListener('click', () => {
        showBuffer(`XIT FIN_${label[1]}`);
      });
    }

    const chartsHeader = document.createElement('h3');
    chartsHeader.appendChild(document.createTextNode('Individual Charts'));
    chartsHeader.classList.add(...Style.SidebarSectionHead);
    tile.appendChild(chartsHeader);

    const chartsDiv = document.createElement('div');
    chartsDiv.style.marginLeft = '5px';
    tile.appendChild(chartsDiv);

    const chartButtons = [
      ['EQUITY HISTORY', 'HISTORY'],
      ['ASSETS BY TYPE', 'ASSETPIE'],
      ['ASSETS BY LOCATION', 'LOCATIONSPIE'],
    ];
    for (const label of chartButtons) {
      const button = document.createElement('button');
      button.classList.add(...Style.Button);
      button.classList.add(...Style.ButtonPrimary);
      button.style.marginBottom = '5px';
      button.textContent = label[0];
      chartsDiv.appendChild(button);
      button.addEventListener('click', () => {
        showBuffer(`XIT FIN_CHART_${label[1]}`);
      });
    }

    const infoHeader = document.createElement('h3');
    infoHeader.appendChild(document.createTextNode('Data Info'));
    infoHeader.classList.add(...Style.SidebarSectionHead);
    tile.appendChild(infoHeader);

    const infoDiv = document.createElement('div');
    tile.appendChild(infoDiv);
    infoDiv.style.margin = '5px';
    const dataPoints = createTextSpan(
      `${(finResult.History ? finResult.History.length : 0).toLocaleString()} data points recorded`,
    );
    infoDiv.appendChild(dataPoints);
    dataPoints.style.display = 'block';
    if (finResult.History) {
      const oldestDate = new Date(finResult.History[0][0]);
      const oldestDateElem = createTextSpan(
        `Oldest data recorded on ${dateYearFormatter.format(oldestDate)}`,
      );
      infoDiv.appendChild(oldestDateElem);
      oldestDateElem.style.marginTop = '5px';
      oldestDateElem.style.display = 'block';

      const newestDate = new Date(finResult.History[finResult.History.length - 1][0]);
      const newestDateElem = createTextSpan(
        `Latest data recorded at ${hourFormatter.format(newestDate)} on ${dateYearFormatter.format(newestDate)}`,
      );
      infoDiv.appendChild(newestDateElem);
      newestDateElem.style.marginTop = '5px';
      newestDateElem.style.display = 'block';
    }
  } else if (parameters[1].toLowerCase() == 'summary' || parameters[1].toLowerCase() == 'sum') {
    widgetAppend(tile, SUMMARY);

    const breakdownHeader = document.createElement('h2');
    breakdownHeader.title = 'Financial Breakdown';
    breakdownHeader.textContent = 'Inventory Breakdown';
    breakdownHeader.classList.add('fin-title');
    tile.appendChild(breakdownHeader);

    const tbody = createTable(tile, ['Name', 'Fixed Assets', 'Current Assets', 'Total Assets']);

    const table = tbody.parentElement;
    if (table) {
      const topRow = table.querySelector('thead > tr');
      if (topRow) {
        for (i = 1; i < topRow.children.length; i++) {
          (topRow.children[i] as HTMLElement).style.textAlign = 'right';
        }
      }
    }

    for (const inv of locationsArray) {
      const row = document.createElement('tr');
      tbody.appendChild(row);

      const firstTableElem = document.createElement('td');
      row.appendChild(firstTableElem);
      firstTableElem.appendChild(createTextSpan(inv[0]));
      inv.shift();

      for (const point of inv) {
        const tableElem = document.createElement('td');
        row.appendChild(tableElem);
        tableElem.appendChild(
          createTextSpan(point.toLocaleString(undefined, { maximumFractionDigits: 0 })),
        );
        tableElem.style.textAlign = 'right';
      }
    }
  } else if (parameters[1].toLowerCase() == 'chart' || parameters[1].toLowerCase() == 'charts') {
    // Some charts summarizing finances
    if (parameters[2]) {
      const graphDiv = document.createElement('div');
      graphDiv.style.margin = '5px';
      tile.appendChild(graphDiv);
      const type = parameters[2].toLowerCase();
      if (type === 'history') {
        appendLineChart(graphDiv, finResult, currency, false);
      } else if (type === 'assetpie') {
        appendAssetPie(graphDiv, finResult);
      } else if (type === 'locationspie') {
        appendLocationsPie(graphDiv, locationsArray);
      } else {
        graphDiv.appendChild(createTextSpan('Error! Not a valid graph type!'));
        return;
      }
    }
    if (finResult.History.length == 0) {
      return;
    }

    const lineHeader = document.createElement('h3');
    lineHeader.appendChild(document.createTextNode('Equity History'));
    lineHeader.classList.add(...Style.SidebarSectionHead);
    tile.appendChild(lineHeader);

    // Line chart of historical financial data
    const historyDiv = document.createElement('div');
    historyDiv.style.margin = '5px';
    historyDiv.style.marginTop = '10px';
    tile.appendChild(historyDiv);

    appendLineChart(historyDiv, finResult, currency, true);
    // linePlot.style.cursor = 'pointer';
    // linePlot.addEventListener('click', () => {
    //   showBuffer('XIT FIN_CHART_HISTORY');
    // });

    const pieHeader = document.createElement('h3');
    pieHeader.appendChild(document.createTextNode('Asset Breakdown'));
    pieHeader.classList.add(...Style.SidebarSectionHead);
    tile.appendChild(pieHeader);

    const pieDiv = document.createElement('div');
    pieDiv.style.margin = '5px';
    tile.appendChild(pieDiv);

    appendAssetPie(pieDiv, finResult);
    // pieCanvas.style.cursor = 'pointer';
    // pieCanvas.style.marginRight = '-25px';
    // pieCanvas.addEventListener('click', () => {
    //   showBuffer('XIT FIN_CHART_ASSETPIE');
    // });

    appendLocationsPie(pieDiv, locationsArray);
    // locPieCanvas.style.cursor = 'pointer';
    // locPieCanvas.addEventListener('click', () => {
    //   showBuffer('XIT FIN_CHART_LOCATIONSPIE');
    // });
  } else if (parameters[1].toLowerCase() == 'production' || parameters[1].toLowerCase() == 'prod') {
    // Revenue/profit derived from burn dat
    tile.textContent = '';
    tile.id = 'pmmg-load-success';

    const planets = [] as string[];
    for (const workforce of workforcesStore.all.value) {
      const name = getPlanetNameFromAddress(workforce.address);
      if (name && !planets.includes(name)) {
        planets.push(name);
      }
    }
    for (const production of productionStore.all.value) {
      const name = getPlanetNameFromAddress(production.address);
      if (name && !planets.includes(name)) {
        planets.push(name);
      }
    }

    const burnFinances = [] as any[][];
    let totalProduced = 0;
    let totalConsumed = 0;
    for (const planet of planets) {
      const site = sitesStore.getByPlanetName(planet);
      if (!site) {
        continue;
      }

      const planetProduction = productionStore.getBySiteId(site.siteId);
      const planetWorkforce = workforcesStore.getById(site.siteId);

      const planetFinances = [] as any[];
      planetFinances.push(planet);
      let produced = 0;
      let consumed = 0;

      if (planetWorkforce) {
        for (const tier of planetWorkforce.workforces) {
          for (const need of tier.needs) {
            consumed += getPrice(cxPrices, need.material.ticker) * need.unitsPerInterval;
          }
        }
      }

      let isRecurring = false;

      if (planetProduction) {
        isRecurring = planetProduction.some(x => x.orders.some(y => y.recurring));

        for (const line of planetProduction) {
          let totalDuration = 0;
          for (const order of line.orders) {
            if (!order.started && (!isRecurring || order.recurring)) {
              totalDuration += order.duration.millis || Infinity;
            }
          }

          for (const order of line.orders) {
            if (!order.started && (!isRecurring || order.recurring)) {
              for (const mat of order.inputs) {
                consumed +=
                  (getPrice(cxPrices, mat.material.ticker) *
                    mat.amount *
                    86400000 *
                    line.capacity) /
                  totalDuration;
              }

              for (const mat of order.outputs) {
                produced +=
                  (getPrice(cxPrices, mat.material.ticker) *
                    mat.amount *
                    86400000 *
                    line.capacity) /
                  totalDuration;
              }
            }
          }
        }
      }

      planetFinances.push(produced);
      planetFinances.push(consumed);
      totalProduced += produced;
      totalConsumed += consumed;

      burnFinances.push(planetFinances);
    }

    const tileHeader = document.createElement('h2');
    tileHeader.title = 'Production Overview';
    tileHeader.textContent = 'Production Overview';
    tileHeader.classList.add('fin-title');
    tile.appendChild(tileHeader);

    tile.appendChild(
      createFinancialTextBox(
        currency + totalProduced.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        'Daily Produced',
        TextColors.Standard,
      ),
    );
    tile.appendChild(
      createFinancialTextBox(
        currency + totalConsumed.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        'Daily Consumed',
        TextColors.Standard,
      ),
    );
    tile.appendChild(
      createFinancialTextBox(
        currency +
          (totalProduced - totalConsumed).toLocaleString(undefined, { maximumFractionDigits: 0 }),
        'Daily Profit',
        totalProduced - totalConsumed > 0 ? TextColors.Success : TextColors.Failure,
      ),
    );

    const planetHeader = document.createElement('h2');
    planetHeader.title = 'Planet Breakdown';
    planetHeader.textContent = 'Planet Breakdown';
    planetHeader.classList.add('fin-title');
    tile.appendChild(planetHeader);

    const tbody = createTable(tile, ['Name', 'Produced', 'Consumed', 'Profit']);

    const table = tbody.parentElement;
    if (table) {
      const topRow = table.querySelector('thead > tr');
      if (topRow) {
        for (i = 1; i < topRow.children.length; i++) {
          (topRow.children[i] as HTMLElement).style.textAlign = 'right';
        }
      }
    }

    burnFinances.sort(burnProductionSort);

    for (const inv of burnFinances) {
      if (inv[1] == 0 && inv[2] == 0) {
        continue;
      }
      const row = document.createElement('tr');
      tbody.appendChild(row);

      const firstTableElem = document.createElement('td');
      row.appendChild(firstTableElem);
      firstTableElem.appendChild(createTextSpan(inv[0]));

      const producedElem = document.createElement('td');
      row.appendChild(producedElem);
      producedElem.appendChild(
        createTextSpan(inv[1].toLocaleString(undefined, { maximumFractionDigits: 0 })),
      );
      producedElem.style.textAlign = 'right';

      const consumedElem = document.createElement('td');
      row.appendChild(consumedElem);
      consumedElem.appendChild(
        createTextSpan(inv[2].toLocaleString(undefined, { maximumFractionDigits: 0 })),
      );
      consumedElem.style.textAlign = 'right';

      const profitElem = document.createElement('td');
      row.appendChild(profitElem);
      profitElem.appendChild(
        createTextSpan((inv[1] - inv[2]).toLocaleString(undefined, { maximumFractionDigits: 0 })),
      );
      profitElem.style.color = inv[1] - inv[2] > 0 ? TextColors.Success : TextColors.Failure;
      profitElem.style.textAlign = 'right';
    }
  }
}

function appendLineChart(container: Element, finResult, currency, maintainAspectRatio) {
  const dateData = [] as any[];
  const finData = [] as any[];

  for (const entry of finResult.History) {
    if (entry[1] + entry[2] + entry[3] - entry[4] == 0) {
      continue;
    }

    dateData.push(new Date(entry[0]).toISOString());
    finData.push(Number((entry[1] + entry[2] + entry[3] - entry[4]).toPrecision(4)));
  }
  widgetAppend(container, EquityHistoryChart, {
    xdata: dateData,
    ydata: finData,
    yprefix: currency,
    maintainAspectRatio,
  });
}

function appendAssetPie(container: Element, finResult) {
  const latestReport = finResult.History[finResult.History.length - 1];
  widgetAppend(container, PieChart, {
    labelData: ['Fixed', 'Current', 'Liquid'],
    numericalData: [latestReport[1], latestReport[2], latestReport[3]],
  });
}

function appendLocationsPie(container: Element, locationsArray) {
  const locationNames = [] as any[];
  const locationValue = [] as any[];
  for (const location of locationsArray) {
    locationNames.push(location[0]);
    locationValue.push(location[1] + location[2] + location[3]);
  }
  widgetAppend(container, PieChart, {
    labelData: locationNames,
    numericalData: locationValue,
  });
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

function financialSort(a, b) {
  return a[3] < b[3] ? 1 : -1;
}

function burnProductionSort(a, b) {
  return a[1] - a[2] < b[1] - b[2] ? 1 : -1;
}

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
