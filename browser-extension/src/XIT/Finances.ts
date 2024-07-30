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
  findCorrespondingPlanet,
  getLocalStorage,
  hourFormatter,
  setSettings,
  showBuffer,
  showWarningDialog,
} from '../util';
import { Style, TextColors } from '../Style';
import { Consumption, CurrencySymbols } from '../GameProperties';
import { generateLineGraph, generatePieChart } from '../charts';
import system from '@src/system';
import user from '@src/prun-api/user';

export class Finances {
  private tile: HTMLElement;
  private parameters: string[];
  private pmmgSettings;
  private userInfo;
  private webData;

  public name = 'FINANCES';

  constructor(tile, parameters, pmmgSettings, userInfo, webData) {
    this.tile = tile;
    this.parameters = parameters;
    this.pmmgSettings = pmmgSettings;
    this.userInfo = userInfo;
    this.webData = webData;
  }

  create_buffer() {
    clearChildren(this.tile);
    if (this.pmmgSettings['PMMGExtended']['recording_financials'] == false) {
      // If not recording financial info, show screen with checkbox to enable
      // Create a header explaining the situation
      const header = document.createElement('h3');
      header.textContent = 'You are not recording daily financial data, would you like to enable recording?';
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
      this.webData,
      this.userInfo,
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
  // Params consists of [tile, parameters, pmmgSettings, webData]
  finResult = finResult['PMMG-Finance'];
  if (!params[0] || !params[1] || !params[2] || !params[3]) {
    return;
  }
  const tile = params[0];
  const parameters = params[1];
  const pmmgSettings = params[2];
  const webData = params[3];
  const userInfo = params[4];
  const finObj = params[5];

  // Determine the array of CX prices to use
  let CX = 'AI1';
  let priceType = 'Average';
  if (pmmgSettings['PMMGExtended']['pricing_scheme']) {
    const interpreted = interpretCX(pmmgSettings['PMMGExtended']['pricing_scheme'], pmmgSettings);
    CX = interpreted[0];
    priceType = interpreted[1];
  }

  if (!userInfo['PMMG-User-Info'] || !userInfo['PMMG-User-Info']['cx_prices']) {
    return;
  }
  const cxPrices = userInfo['PMMG-User-Info']['cx_prices'][CX][priceType]; // Dictionary containing prices keyed to material tickers

  // Calculate price basket
  const weights = { PIO: 0.7435, SET: 0.1954, TEC: 0.0444, ENG: 0.0132, SCI: 0.0035 };

  let priceBasket = 0;

  Object.keys(Consumption).forEach(workforce => {
    let tierCost = 0;
    Object.keys(Consumption[workforce]).forEach(mat => {
      tierCost += averageCX(userInfo['PMMG-User-Info']['cx_prices'], mat) * Consumption[workforce][mat];
    });

    priceBasket += tierCost * weights[workforce];
  });

  priceBasket /= 2030.55; // Normalize by prices on 12/27/2023
  //console.log(priceBasket);

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
  if (parameters[1] && (parameters[1].toLowerCase() == 'settings' || parameters[1].toLowerCase() == 'set')) {
    // Create option for choosing pricing
    const pricingHeader = document.createElement('h3');
    pricingHeader.appendChild(document.createTextNode('Pricing Scheme'));
    pricingHeader.appendChild(createToolTip('Select a pricing scheme to calculate financials.', 'right'));
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
    Object.keys(PricingSchemes).forEach(name => {
      priceSelect.appendChild(createSelectOption(name, name));
    });

    // Add custom options
    Object.keys(CustomSchemes).forEach(name => {
      priceSelect.appendChild(createSelectOption(name, name));
    });

    // Set value to what is in settings
    if (
      !pmmgSettings['PMMGExtended']['pricing_scheme'] ||
      (!PricingSchemes[pmmgSettings['PMMGExtended']['pricing_scheme']] &&
        !CustomSchemes[pmmgSettings['PMMGExtended']['pricing_scheme']])
    ) {
      (priceSelect.children[0] as HTMLOptionElement).selected = true;
    } else if (PricingSchemes[pmmgSettings['PMMGExtended']['pricing_scheme']]) {
      (
        priceSelect.children[PricingSchemes[pmmgSettings['PMMGExtended']['pricing_scheme']]] as HTMLOptionElement
      ).selected = true;
    } else {
      (
        priceSelect.children[CustomSchemes[pmmgSettings['PMMGExtended']['pricing_scheme']]] as HTMLOptionElement
      ).selected = true;
    }

    priceSelect.classList.add('select');
    priceSelect.style.marginLeft = '4px';

    // Create a div for Custom (Spreadsheet) option. Only visible if custom spreadsheet option is selected
    const spreadsheetDiv = document.createElement('div');
    if (pmmgSettings['PMMGExtended']['pricing_scheme'] != 'Custom (Spreadsheet)') {
      spreadsheetDiv.style.display = 'none';
    }

    // Detect if changed to custom spreadsheet. Show or hide div accordingly
    priceSelect.addEventListener('change', () => {
      pmmgSettings['PMMGExtended']['pricing_scheme'] = priceSelect.selectedOptions[0].value;
      setSettings(pmmgSettings);
      switch (priceSelect.selectedOptions[0].value) {
        case 'Custom (Spreadsheet)':
          spreadsheetDiv.style.display = 'block';
          break;
        default:
          spreadsheetDiv.style.display = 'none';
      }
    });

    priceDiv.appendChild(priceSelect);

    tile.appendChild(spreadsheetDiv);

    // Create options for importing from spreadsheet

    // Set back up prices in case spreadsheet does not have a price for material
    const backupDiv = document.createElement('div');
    backupDiv.style.marginTop = '8px';
    const backupPriceLabel = createTextSpan('Back Up Pricing Scheme:');
    backupPriceLabel.style.marginBottom = '4px';
    backupDiv.appendChild(backupPriceLabel);
    spreadsheetDiv.appendChild(backupDiv);

    const backupPriceSelect = document.createElement('select');
    backupDiv.appendChild(backupPriceSelect);

    backupPriceSelect.name = 'backup-price-select';
    backupPriceSelect.id = 'backup-price-select';

    // Only add options for CXs
    Object.keys(PricingSchemes).forEach(name => {
      backupPriceSelect.appendChild(createSelectOption(name, name));
    });

    // Set according to previous settings
    if (
      !pmmgSettings['PMMGExtended']['backup_pricing_scheme'] ||
      !PricingSchemes[pmmgSettings['PMMGExtended']['backup_pricing_scheme']]
    ) {
      (backupPriceSelect.children[0] as HTMLOptionElement).selected = true;
    } else {
      (
        backupPriceSelect.children[
          PricingSchemes[pmmgSettings['PMMGExtended']['backup_pricing_scheme']]
        ] as HTMLOptionElement
      ).selected = true;
    }

    backupPriceSelect.classList.add('select');
    backupPriceSelect.style.marginLeft = '4px';
    // Listen for change to pricing scheme, update settings accordingly
    backupPriceSelect.addEventListener('change', () => {
      pmmgSettings['PMMGExtended']['backup_pricing_scheme'] = backupPriceSelect.selectedOptions[0].value;
      setSettings(pmmgSettings);
    });

    // Spreadsheet URL entry
    const urlDiv = document.createElement('div');
    spreadsheetDiv.appendChild(urlDiv);

    const urlLabel = createTextSpan('Spreadsheet URL:');
    //urlLabel.style.marginBottom = "4px";
    urlDiv.appendChild(urlLabel);

    const urlInput = document.createElement('input');
    urlInput.classList.add('input-text');
    urlDiv.appendChild(urlInput);
    urlInput.style.marginLeft = '4px';
    if (pmmgSettings['PMMGExtended']['fin_spreadsheet']) {
      urlInput.value = pmmgSettings['PMMGExtended']['fin_spreadsheet'];
    }
    urlInput.addEventListener('input', () => {
      pmmgSettings['PMMGExtended']['fin_spreadsheet'] = urlInput.value == '' ? undefined : urlInput.value;
      setSettings(pmmgSettings);
    });

    // Sheet name entry
    const sheetDiv = document.createElement('div');
    spreadsheetDiv.appendChild(sheetDiv);
    const sheetLabel = createTextSpan('Sheet Name:');
    sheetLabel.style.marginBottom = '4px';
    sheetDiv.appendChild(sheetLabel);

    const sheetInput = document.createElement('input');
    sheetDiv.appendChild(sheetInput);
    sheetInput.classList.add('input-text');
    sheetInput.style.marginLeft = '4px';
    if (pmmgSettings['PMMGExtended']['fin_sheet_name']) {
      sheetInput.value = pmmgSettings['PMMGExtended']['fin_sheet_name'];
    }
    sheetInput.addEventListener('input', () => {
      pmmgSettings['PMMGExtended']['fin_sheet_name'] = sheetInput.value == '' ? undefined : sheetInput.value;
      setSettings(pmmgSettings);
    });

    // Table summarizing prices
    const resultDiv = document.createElement('div');
    spreadsheetDiv.appendChild(resultDiv);
    if (pmmgSettings['PMMGExtended']['fin_spreadsheet'] && pmmgSettings['PMMGExtended']['fin_sheet_name']) {
      const sheetID = pmmgSettings['PMMGExtended']['fin_spreadsheet'].match(/\/d\/([^/]+)/);
      if (sheetID && sheetID[1]) {
        drawGSTable(resultDiv, webData['custom_prices']);
      }
    }

    // Create option to import/export data
    const importHeader = document.createElement('h3');
    importHeader.appendChild(document.createTextNode('Import/Export Data'));
    importHeader.appendChild(createToolTip('Import or export financial data to a json file.', 'right'));
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
          Object.keys(fileOutput).forEach(key => {
            finResult[key] = fileOutput[key];
            return;
          });

          setSettings({ 'PMMG-Finance': finResult });
          errorTextBox.style.display = 'none';
        } catch (ex) {
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
      Object.keys(finResult).forEach(key => {
        output[key] = finResult[key];
      });

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
      calculateFinancials(webData, userInfo, pmmgSettings, true);
      finObj.create_buffer();
    });

    // Create option to purge individual data points
    const purgeHeader = document.createElement('h3');
    purgeHeader.appendChild(document.createTextNode('Purge Specific Data Points'));
    purgeHeader.appendChild(createToolTip('Purge individual data points from storage.', 'right'));
    purgeHeader.classList.add(...Style.SidebarSectionHead);
    tile.appendChild(purgeHeader);

    const tbody = createTable(tile, ['Date', 'Equity', 'Delete']);

    for (i = 0; i < finResult['History'].length; i++) {
      const row = document.createElement('tr');
      tbody.appendChild(row);

      const dateColumn = document.createElement('td');
      dateColumn.appendChild(
        createTextSpan(
          `${hourFormatter.format(new Date(finResult['History'][i][0]))} on ${dateYearFormatter.format(
            new Date(finResult['History'][i][0]),
          )}`,
        ),
      );
      row.appendChild(dateColumn);

      const equityColumn = document.createElement('td');
      const equity =
        finResult['History'][i][1] +
        finResult['History'][i][2] +
        finResult['History'][i][3] -
        finResult['History'][i][4];
      equityColumn.appendChild(createTextSpan(equity.toLocaleString(undefined, { maximumFractionDigits: 0 })));
      row.appendChild(equityColumn);

      const deleteColumn = document.createElement('td');
      deleteColumn.appendChild(
        createSmallButton(
          'delete',
          index => {
            showWarningDialog(tile, 'Are you sure you want to delete this datapoint?', 'Confirm', () => {
              // That's a lot of nested stuff...

              finResult['History'].splice(index, 1);
              setSettings({ 'PMMG-Finance': finResult });
              finObj.create_buffer();
            });
          },
          [i],
        ),
      );
      row.appendChild(deleteColumn);
    }

    // Create option for clearing data
    const clearHeader = document.createElement('h3');
    clearHeader.appendChild(document.createTextNode('Clear All Data'));
    clearHeader.appendChild(createToolTip('Clear all current and historical financial data.', 'right'));
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
  finResult['Buildings'].forEach(inv => {
    if (locations[inv[0]]) {
      locations[inv[0]][0] += inv[1];
      locations[inv[0]][2] += inv[1];
    } else {
      locations[inv[0]] = [inv[1], 0, inv[1]];
    }
  });

  finResult['Inventory'].forEach(inv => {
    if (locations[inv[0]]) {
      locations[inv[0]][1] += inv[1];
      locations[inv[0]][2] += inv[1];
    } else {
      locations[inv[0]] = [0, inv[1], inv[1]];
    }
  });

  const locationsArray = [] as any[]; // Rework into common array different screens use
  Object.keys(locations).forEach(inv => {
    locationsArray.push([inv, locations[inv][0], locations[inv][1], locations[inv][2]]);
  });
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
    quickButtons.forEach(label => {
      const button = document.createElement('button');
      button.classList.add(...Style.Button);
      button.classList.add(...Style.ButtonPrimary);
      button.style.marginBottom = '5px';
      button.textContent = label[0];
      quickDiv.appendChild(button);
      button.addEventListener('click', () => {
        showBuffer(`XIT FIN_${label[1]}`);
      });
    });

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
    chartButtons.forEach(label => {
      const button = document.createElement('button');
      button.classList.add(...Style.Button);
      button.classList.add(...Style.ButtonPrimary);
      button.style.marginBottom = '5px';
      button.textContent = label[0];
      chartsDiv.appendChild(button);
      button.addEventListener('click', () => {
        showBuffer(`XIT FIN_CHART_${label[1]}`);
      });
    });

    const infoHeader = document.createElement('h3');
    infoHeader.appendChild(document.createTextNode('Data Info'));
    infoHeader.classList.add(...Style.SidebarSectionHead);
    tile.appendChild(infoHeader);

    const infoDiv = document.createElement('div');
    tile.appendChild(infoDiv);
    infoDiv.style.margin = '5px';
    const dataPoints = createTextSpan(
      `${(finResult['History'] ? finResult['History'].length : 0).toLocaleString()} data points recorded`,
    );
    infoDiv.appendChild(dataPoints);
    dataPoints.style.display = 'block';
    if (finResult['History']) {
      const oldestDate = new Date(finResult['History'][0][0]);
      const oldestDateElem = createTextSpan(`Oldest data recorded on ${dateYearFormatter.format(oldestDate)}`);
      infoDiv.appendChild(oldestDateElem);
      oldestDateElem.style.marginTop = '5px';
      oldestDateElem.style.display = 'block';

      const newestDate = new Date(finResult['History'][finResult['History'].length - 1][0]);
      const newestDateElem = createTextSpan(
        `Latest data recorded at ${hourFormatter.format(newestDate)} on ${dateYearFormatter.format(newestDate)}`,
      );
      infoDiv.appendChild(newestDateElem);
      newestDateElem.style.marginTop = '5px';
      newestDateElem.style.display = 'block';
    }
  } else if (parameters[1].toLowerCase() == 'summary' || parameters[1].toLowerCase() == 'sum') {
    // Summary financial screen (like FIN)
    const lastReading = finResult['History'][finResult['History'].length - 1];

    const lastEquity = lastReading[1] + lastReading[2] + lastReading[3] - lastReading[4];
    const tileHeader = document.createElement('h2');
    tileHeader.title = 'Financial Overview';
    tileHeader.textContent = 'Key Figures';
    tileHeader.classList.add('fin-title');
    tile.appendChild(tileHeader);

    tile.appendChild(
      createFinancialTextBox(
        currency + Math.round(lastReading[1]).toLocaleString(),
        'Fixed Assets',
        TextColors.Standard,
      ),
    );
    tile.appendChild(
      createFinancialTextBox(
        currency + Math.round(lastReading[2]).toLocaleString(),
        'Current Assets',
        TextColors.Standard,
      ),
    );
    tile.appendChild(
      createFinancialTextBox(
        currency + Math.round(lastReading[3]).toLocaleString(),
        'Liquid Assets',
        TextColors.Standard,
      ),
    );
    tile.appendChild(
      createFinancialTextBox(currency + Math.round(lastEquity).toLocaleString(), 'Equity', TextColors.Standard),
    );
    tile.appendChild(
      createFinancialTextBox(
        currency + Math.round(lastReading[4]).toLocaleString(),
        'Liabilities',
        TextColors.Standard,
      ),
    );

    for (i = finResult['History'].length - 1; i >= 0; i--) {
      if (lastReading[0] - finResult['History'][i][0] > 86400000 * 7) {
        break;
      }
    }
    i++;

    const prevEquity =
      finResult['History'][i][1] + finResult['History'][i][2] + finResult['History'][i][3] - finResult['History'][i][4];
    const profit = Math.round(lastEquity - prevEquity);
    const color = profit > 0 ? TextColors.Success : TextColors.Failure;
    tile.appendChild(createFinancialTextBox(currency + profit.toLocaleString(), 'Profit', color));

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

    locationsArray.forEach(inv => {
      const row = document.createElement('tr');
      tbody.appendChild(row);

      const firstTableElem = document.createElement('td');
      row.appendChild(firstTableElem);
      firstTableElem.appendChild(createTextSpan(inv[0]));
      inv.shift();

      for (const point of inv) {
        const tableElem = document.createElement('td');
        row.appendChild(tableElem);
        tableElem.appendChild(createTextSpan(point.toLocaleString(undefined, { maximumFractionDigits: 0 })));
        tableElem.style.textAlign = 'right';
      }
    });
  } else if (parameters[1].toLowerCase() == 'chart' || parameters[1].toLowerCase() == 'charts') {
    // Some charts summarizing finances
    if (parameters[2]) {
      const graphDiv = document.createElement('div');
      graphDiv.style.margin = '5px';
      const tileDims = tile.getBoundingClientRect();
      const width = tileDims.width > 10 ? tileDims.width - 10 : 10;
      const height = tileDims.height > 10 ? tileDims.height - 10 : 10;
      tile.appendChild(graphDiv);
      const graph = generateGraph(parameters[2], finResult, locationsArray, currency, width, height);
      if (!graph) {
        graphDiv.appendChild(createTextSpan('Error! Not a valid graph type!'));
        return;
      }
      graphDiv.appendChild(graph);
      return;
    }
    if (finResult['History'].length == 0) {
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

    const linePlot = generateGraph('history', finResult, locationsArray, currency);
    if (!linePlot) {
      return;
    }
    linePlot.style.cursor = 'pointer';
    linePlot.addEventListener('click', () => {
      showBuffer('XIT FIN_CHART_HISTORY');
    });

    historyDiv.appendChild(linePlot);

    const pieHeader = document.createElement('h3');
    pieHeader.appendChild(document.createTextNode('Asset Breakdown'));
    pieHeader.classList.add(...Style.SidebarSectionHead);
    tile.appendChild(pieHeader);

    const pieDiv = document.createElement('div');
    pieDiv.style.margin = '5px';
    tile.appendChild(pieDiv);

    // Pie chart of current financial split
    const pieCanvas = generateGraph('assetpie', finResult, locationsArray, currency);
    if (!pieCanvas) {
      return;
    }
    pieCanvas.style.cursor = 'pointer';
    pieCanvas.style.marginRight = '-25px';
    pieCanvas.addEventListener('click', () => {
      showBuffer('XIT FIN_CHART_ASSETPIE');
    });
    pieDiv.appendChild(pieCanvas);

    // Pie chart of where fixed/current assets are located
    const locPieCanvas = generateGraph('locationspie', finResult, locationsArray, currency);
    if (!locPieCanvas) {
      return;
    }
    locPieCanvas.style.cursor = 'pointer';
    locPieCanvas.addEventListener('click', () => {
      showBuffer('XIT FIN_CHART_LOCATIONSPIE');
    });
    pieDiv.appendChild(locPieCanvas);
  } else if (parameters[1].toLowerCase() == 'production' || parameters[1].toLowerCase() == 'prod') {
    // Revenue/profit derived from burn data
    if (!userInfo['PMMG-User-Info'] || !userInfo['PMMG-User-Info']['workforce']) {
      tile.id = 'pmmg-reload';
      return;
    }
    tile.textContent = '';
    tile.id = 'pmmg-load-success';

    // Calculate the player burn from userInfo
    const planets = [] as string[];
    userInfo['PMMG-User-Info']['workforce'].forEach(workforce => {
      if (workforce.PlanetName && !planets.includes(workforce.PlanetName)) {
        planets.push(workforce.PlanetName);
      }
    });
    userInfo['PMMG-User-Info']['production'].forEach(production => {
      if (production.PlanetName && !planets.includes(production.PlanetName)) {
        planets.push(production.PlanetName);
      }
    });

    const burnFinances = [] as any[][];
    let totalProduced = 0;
    let totalConsumed = 0;
    planets.forEach(planet => {
      const planetProduction = findCorrespondingPlanet(planet, userInfo['PMMG-User-Info']['production']);
      const planetWorkforce = findCorrespondingPlanet(planet, userInfo['PMMG-User-Info']['workforce']);

      const planetFinances = [] as any[];
      planetFinances.push(planet);
      let produced = 0;
      let consumed = 0;

      if (planetWorkforce) {
        planetWorkforce.workforce.forEach(tier => {
          tier.needs.forEach(need => {
            consumed +=
              getPrice(
                cxPrices,
                webData['custom_prices'],
                pmmgSettings['PMMGExtended']['pricing_scheme'],
                need.material.ticker,
                userInfo,
                priceBasket,
              ) * need.unitsPerInterval;
          });
        });
      }

      let isRecurring = false;

      if (planetProduction && planetProduction.lines) {
        planetProduction.lines.forEach(line => {
          line.orders.forEach(order => {
            if (order.recurring) {
              isRecurring = true;
            }
          });
        });

        planetProduction.lines.forEach(line => {
          let totalDuration = 0;
          line.orders.forEach(order => {
            if (!order.started && (!isRecurring || order.recurring)) {
              totalDuration += order.duration || Infinity;
            }
          });

          line.orders.forEach(order => {
            if (!order.started && (!isRecurring || order.recurring)) {
              order.inputs.forEach(mat => {
                consumed +=
                  (getPrice(
                    cxPrices,
                    webData['custom_prices'],
                    pmmgSettings['PMMGExtended']['pricing_scheme'],
                    mat.MaterialTicker,
                    userInfo,
                    priceBasket,
                  ) *
                    mat.Amount *
                    86400000 *
                    line.capacity) /
                  totalDuration;
              });

              order.outputs.forEach(mat => {
                produced +=
                  (getPrice(
                    cxPrices,
                    webData['custom_prices'],
                    pmmgSettings['PMMGExtended']['pricing_scheme'],
                    mat.MaterialTicker,
                    userInfo,
                    priceBasket,
                  ) *
                    mat.Amount *
                    86400000 *
                    line.capacity) /
                  totalDuration;
              });
            }
          });
        });
      }

      planetFinances.push(produced);
      planetFinances.push(consumed);
      totalProduced += produced;
      totalConsumed += consumed;

      burnFinances.push(planetFinances);
    });

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
        currency + (totalProduced - totalConsumed).toLocaleString(undefined, { maximumFractionDigits: 0 }),
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

    burnFinances.forEach(inv => {
      if (inv[1] == 0 && inv[2] == 0) {
        return;
      }
      const row = document.createElement('tr');
      tbody.appendChild(row);

      const firstTableElem = document.createElement('td');
      row.appendChild(firstTableElem);
      firstTableElem.appendChild(createTextSpan(inv[0]));

      const producedElem = document.createElement('td');
      row.appendChild(producedElem);
      producedElem.appendChild(createTextSpan(inv[1].toLocaleString(undefined, { maximumFractionDigits: 0 })));
      producedElem.style.textAlign = 'right';

      const consumedElem = document.createElement('td');
      row.appendChild(consumedElem);
      consumedElem.appendChild(createTextSpan(inv[2].toLocaleString(undefined, { maximumFractionDigits: 0 })));
      consumedElem.style.textAlign = 'right';

      const profitElem = document.createElement('td');
      row.appendChild(profitElem);
      profitElem.appendChild(createTextSpan((inv[1] - inv[2]).toLocaleString(undefined, { maximumFractionDigits: 0 })));
      profitElem.style.color = inv[1] - inv[2] > 0 ? TextColors.Success : TextColors.Failure;
      profitElem.style.textAlign = 'right';
    });
  }
}

function averageCX(prices, ticker) {
  const CXs = ['AI1', 'NC1', 'IC1', 'CI1'];

  let cxCount = 0;
  let price = 0;

  CXs.forEach(cx => {
    if (prices[cx]['Average'][ticker]) {
      cxCount++;
      price += prices[cx]['Average'][ticker];
    }
  });

  return cxCount == 0 ? 0 : price / cxCount;
}

function drawGSTable(resultDiv, prices) {
  if (!prices) {
    resultDiv.appendChild(createTextSpan('Error! No Prices Found!'));
  }

  const tbody = createTable(resultDiv, ['Ticker', 'Price']);
  Object.keys(prices).forEach(mat => {
    const row = document.createElement('tr');
    const matElem = document.createElement('td');
    row.appendChild(matElem);
    matElem.appendChild(createTextSpan(mat));

    const priceElem = document.createElement('td');
    row.appendChild(priceElem);
    priceElem.appendChild(
      createTextSpan(
        prices[mat].toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }),
      ),
    );

    tbody.appendChild(row);
  });
}

function generateGraph(graphType, finResult, locationsArray, currency, width = 400, height = 200) {
  switch (graphType.toLowerCase()) {
    case 'history': {
      const dateData = [] as any[];
      const finData = [] as any[];

      finResult['History'].forEach(entry => {
        if (entry[1] + entry[2] + entry[3] - entry[4] == 0) {
          return;
        }

        dateData.push(new Date(entry[0]).toISOString());
        finData.push(Number((entry[1] + entry[2] + entry[3] - entry[4]).toPrecision(4)));
      });
      return generateLineGraph(
        dateData,
        finData,
        'Date',
        'Equity',
        width,
        height,
        'time',
        'linear',
        '',
        currency,
        'dd/MM',
      );
    }
    case 'assetpie': {
      const latestReport = finResult['History'][finResult['History'].length - 1];
      return generatePieChart(
        ['Fixed', 'Current', 'Liquid'],
        [latestReport[1], latestReport[2], latestReport[3]],
        width,
        height,
      );
    }
    case 'locationspie': {
      const locationNames = [] as any[];
      const locationValue = [] as any[];
      locationsArray.forEach(location => {
        locationNames.push(location[0]);
        locationValue.push(location[1] + location[2] + location[3]);
      });

      return generatePieChart(locationNames, locationValue, width, height);
    }
  }
  return null;
}

function clearData(result) {
  if (result['PMMGExtended']) {
    result['PMMGExtended']['last_fin_recording'] = undefined;
    setSettings(result);
  }
  system.storage.local.remove('PMMG-Finance');
}

function getPrice(cxPrices, customPrices, priceScheme, ticker, userInfo, priceBasket) {
  if (priceScheme == 'Custom (Spreadsheet)' && customPrices && customPrices[ticker]) {
    return customPrices[ticker];
  } else if (priceScheme == 'Price Basket') {
    return averageCX(userInfo['PMMG-User-Info']['cx_prices'], ticker) / priceBasket;
  }

  return cxPrices[ticker] || 0;
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

const CustomSchemes = {
  'Custom (Spreadsheet)': 18,
  //	"Price Basket": 19
};

// Actually recording and processing the financials once they are received through BackgroundRunner.
export function calculateFinancials(webData, userInfo, result, loop) {
  //playerData, contracts, prices, cxos
  // Wait until contracts and prices are in
  if (loop) {
    if (userInfo['PMMG-User-Info'] && userInfo['PMMG-User-Info']['cx_prices']) {
      window.setTimeout(() => calculateFinancials(webData, userInfo, result, false), 100);
      return;
    }
    window.setTimeout(() => calculateFinancials(webData, userInfo, result, true), 50);
    return;
  }

  result['PMMGExtended']['last_fin_recording'] = Date.now();
  setSettings(result);

  let CX = 'AI1';
  let priceType = 'Average';
  if (result['PMMGExtended']['pricing_scheme']) {
    const interpreted = interpretCX(result['PMMGExtended']['pricing_scheme'], result);
    CX = interpreted[0];
    priceType = interpreted[1];
  }

  const cxPrices = userInfo['PMMG-User-Info']['cx_prices'][CX][priceType];

  // Calculate price basket
  const weights = { PIO: 0.7435, SET: 0.1954, TEC: 0.0444, ENG: 0.0132, SCI: 0.0035 };

  let priceBasket = 0;

  Object.keys(Consumption).forEach(workforce => {
    let tierCost = 0;
    Object.keys(Consumption[workforce]).forEach(mat => {
      tierCost += averageCX(userInfo['PMMG-User-Info']['cx_prices'], mat) * Consumption[workforce][mat];
    });

    priceBasket += tierCost * weights[workforce];
  });

  priceBasket /= 2030.55; // Normalize by prices on 12/27/2023

  // Now we have the data, find financial value
  const finSnapshot = {};

  // Get currencies
  finSnapshot['Currencies'] = [];

  if (userInfo['PMMG-User-Info']['currency']) {
    userInfo['PMMG-User-Info']['currency'].forEach(currency => {
      finSnapshot['Currencies'].push([currency['currency'], Math.round(currency['amount'] * 100) / 100]);
    });
  }

  // Put together inventory value
  finSnapshot['Inventory'] = [];
  finSnapshot['Buildings'] = [];

  if (userInfo['PMMG-User-Info']['storage']) {
    userInfo['PMMG-User-Info']['storage'].forEach(location => {
      let value = 0;

      location['items'].forEach(mat => {
        value +=
          getPrice(
            cxPrices,
            webData['custom_prices'],
            result['PMMGExtended']['pricing_scheme'],
            mat.MaterialTicker,
            userInfo,
            priceBasket,
          ) * mat.Amount;
      });

      let name;
      if (location.type == 'STORE' || location.type == 'WAREHOUSE_STORE') {
        name = location.PlanetName;
      } else {
        name = location.name;
      }

      if (value == 0) {
        return;
      }

      let isMatch = false; // Consolidate multiple storages down into one (warehouses + bases or cargo + stl + ftl tanks)
      finSnapshot['Inventory'].forEach(inv => {
        if (inv[0] == name) {
          isMatch = true;
          inv[1] += Math.round(value * 100) / 100;
        }
      });
      if (!isMatch) {
        finSnapshot['Inventory'].push([name, Math.round(value * 100) / 100]);
      }
      return;
    });
  }
  // Put together building value
  if (userInfo['PMMG-User-Info']['sites']) {
    userInfo['PMMG-User-Info']['sites'].forEach(location => {
      if (location.type != 'BASE') {
        return;
      }
      let value = 0;
      location['buildings'].forEach(building => {
        building['reclaimableMaterials'].forEach(mat => {
          value +=
            getPrice(
              cxPrices,
              webData['custom_prices'],
              result['PMMGExtended']['pricing_scheme'],
              mat.material.ticker,
              userInfo,
              priceBasket,
            ) * mat.amount;
        });
      });
      if (value == 0) {
        return;
      }
      finSnapshot['Buildings'].push([location.PlanetName, Math.round(value * 100) / 100]);
    });
  }

  // Handle contracts
  let contractValue = 0;
  let contractLiability = 0;
  if (userInfo['PMMG-User-Info']['contracts']) {
    const validContracts = userInfo['PMMG-User-Info']['contracts'].filter(
      c => !invalidContractStatus.includes(c['status']),
    );

    validContracts.forEach(contract => {
      const party = contract['party'];
      //console.log(party)
      contract['conditions'].forEach(condition => {
        if (condition['status'] == 'FULFILLED') {
          return;
        }
        if (condition['type'] == 'DELIVERY' || condition['type'] == 'PROVISION') {
          if (condition['party'] == party) {
            contractLiability +=
              getPrice(
                cxPrices,
                webData['custom_prices'],
                result['PMMGExtended']['pricing_scheme'],
                condition.quantity.material.ticker,
                userInfo,
                priceBasket,
              ) * condition.quantity.amount;
          } else {
            contractValue +=
              getPrice(
                cxPrices,
                webData['custom_prices'],
                result['PMMGExtended']['pricing_scheme'],
                condition.quantity.material.ticker,
                userInfo,
                priceBasket,
              ) * condition.quantity.amount;
          }
        } else if (condition['type'] == 'PAYMENT') {
          if (condition['party'] == party) {
            contractLiability += condition.amount.amount;
          } else {
            contractValue += condition.amount.amount;
          }
        } else if (condition['type'] == 'LOAN_INSTALLMENT') {
          if (condition['party'] == party) {
            contractLiability += condition.interest.amount + condition.repayment.amount;
          } else {
            contractValue += condition.interest.amount + condition.repayment.amount;
          }
        } else if (condition['type'] == 'LOAN_PAYOUT') {
          if (condition['party'] == party) {
            contractLiability += condition.amount.amount;
          } else {
            contractValue += condition.amount.amount;
          }
        }
      });
    });
    finSnapshot['ContractValue'] = Math.round(contractValue * 100) / 100;
    finSnapshot['ContractLiability'] = Math.round(contractLiability * 100) / 100;
  }

  // Handle CXOS
  let cxBuyValue = 0;
  let cxSellValue = 0;

  user.cxos.forEach(order => {
    if (order.status == 'FILLED') {
      return;
    }

    if (order.type == 'SELLING') {
      cxSellValue +=
        getPrice(
          cxPrices,
          webData['custom_prices'],
          result['PMMGExtended']['pricing_scheme'],
          order.material.ticker,
          userInfo,
          priceBasket,
        ) * order.amount;
    } else {
      cxBuyValue += order.limit.amount * order.amount;
    }
  });

  // Handle FXOS
  let fxBuyValue = 0;
  let fxSellValue = 0;
  user.fxos.forEach(order => {
    if (order.status == 'FILLED') {
      return;
    }

    if (order.type == 'SELLING') {
      fxSellValue += order.initialAmount.amount;
    } else {
      fxBuyValue += order.limit.rate * order.initialAmount.amount;
    }
  });

  finSnapshot['CXBuy'] = Math.round(cxBuyValue * 100) / 100;
  finSnapshot['CXSell'] = Math.round(cxSellValue * 100) / 100;
  finSnapshot['FXBuy'] = Math.round(fxBuyValue * 100) / 100;
  finSnapshot['FXSell'] = Math.round(fxSellValue * 100) / 100;

  let liquid = 0;
  finSnapshot['Currencies'].forEach(currency => {
    liquid += currency[1];
  });
  liquid += cxBuyValue + fxBuyValue + fxSellValue;

  let fixed = 0;
  finSnapshot['Buildings'].forEach(inv => {
    fixed += inv[1];
  });

  let current = cxSellValue + contractValue;
  finSnapshot['Inventory'].forEach(inv => {
    current += inv[1];
  });

  const liabilities = contractLiability;
  //console.log(finSnapshot);
  // History stored as [time, fixed, current, liquid, liabilities]
  finSnapshot['History'] = [
    Date.now(),
    Math.round(fixed * 100) / 100,
    Math.round(current * 100) / 100,
    Math.round(liquid * 100) / 100,
    Math.round(liabilities * 100) / 100,
  ];
  getLocalStorage('PMMG-Finance', writeFinancials, finSnapshot);
}

function writeFinancials(result, finSnapshot) {
  let history = [] as any[];
  if (result['PMMG-Finance'] && result['PMMG-Finance']['History']) {
    history = result['PMMG-Finance']['History'];
  }
  history.push(finSnapshot['History']);
  finSnapshot['History'] = history;
  result['PMMG-Finance'] = finSnapshot;
  setSettings(result);
}

const invalidContractStatus = ['FULFILLED', 'BREACHED', 'TERMINATED', 'CANCELLED', 'REJECTED'];

function financialSort(a, b) {
  return a[3] < b[3] ? 1 : -1;
}

function burnProductionSort(a, b) {
  return a[1] - a[2] < b[1] - b[2] ? 1 : -1;
}

function interpretCX(CXString, result) {
  let CX = 'AI1';
  let priceType = 'Average';
  switch (CXString) {
    case 'Price Basket':
      break;
    case 'Custom (Spreadsheet)':
      if (result['PMMGExtended']['backup_pricing_scheme']) {
        const data = interpretCX(result['PMMGExtended']['backup_pricing_scheme'], result);
        CX = data[0];
        priceType = data[1];
      }
      break;
    default: {
      const info = CXString.split(' ');
      CX = info[0];
      switch (info[1]) {
        case 'AVG':
          priceType = 'Average';
          break;
        case 'ASK':
          priceType = 'AskPrice';
          break;
        case 'BID':
          priceType = 'BidPrice';
          break;
      }
    }
  }
  return [CX, priceType];
}
