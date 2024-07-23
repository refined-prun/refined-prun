import {
  clearChildren,
  createTextSpan,
  setSettings,
  CategorySort,
  findCorrespondingPlanet,
  createMaterialElement,
  calculateBurn,
  createSettingsButton,
  comparePlanets,
} from '../util';
import { Selector } from '../Selector';
import materials from '@src/prun-api/materials';

export class Burn {
  private tile: HTMLElement;
  private parameters: string[];
  private pmmgSettings;
  private userInfo;
  private alive;
  public name: string;
  private planetBurn;

  constructor(tile, parameters, pmmgSettings, userInfo) {
    this.tile = tile;
    this.parameters = parameters;
    this.pmmgSettings = pmmgSettings;
    this.userInfo = userInfo;
    this.alive = true;

    if (parameters[1] && !parameters[2]) {
      this.name = 'ENHANCED BURN - ' + parameters[1].toUpperCase();
    } else {
      this.name = 'ENHANCED BURN';
    }
  }

  create_buffer() {
    // Set static versions of class parameters to be passed to functions downstream
    const parameters = this.parameters;
    const pmmgSettings = this.pmmgSettings;

    if (!this.userInfo['PMMG-User-Info'] || !this.userInfo['PMMG-User-Info']['workforce']) {
      clearChildren(this.tile);
      this.tile.textContent = 'Loading Burn Data...';
      this.tile.id = 'pmmg-reload';
      return;
    }

    const planetBurn = internalCalculateBurn(this.parameters, this.userInfo);

    if (this.planetBurn && this.planetBurn.length == planetBurn.length) {
      // Has been calculated, no update in length
      let mismatchFound = false;

      for (let i = 0; i < planetBurn.length; i++) {
        Object.keys(planetBurn[i].burn).forEach(mat => {
          if (
            !this.planetBurn[i].burn[mat] ||
            this.planetBurn[i].burn[mat].DaysLeft != planetBurn[i].burn[mat].DaysLeft
          ) {
            mismatchFound = true;
          }
        });
        if (mismatchFound) {
          break;
        }
      }
      if (!mismatchFound) {
        // If nothing is different, don't update
        this.update_buffer();
        return;
      }
    }

    this.planetBurn = planetBurn;

    clearChildren(this.tile);

    // Burn data is non-empty
    this.tile.id = 'pmmg-load-success';

    // Start creating burn buffer

    const screenNameElem = document.querySelector(Selector.ScreenName);
    const screenName = screenNameElem ? screenNameElem.textContent : '';

    const bufferName = screenName + this.parameters.join('');

    if (!this.pmmgSettings['PMMGExtended']['burn_settings']) {
      this.pmmgSettings['PMMGExtended']['burn_settings'] = {};
    }
    const dispSettings = this.pmmgSettings['PMMGExtended']['burn_settings'][bufferName] || {
      red: true,
      yellow: true,
      green: true,
      inf: true,
      minimized: {},
    };

    const table = document.createElement('table');
    const bufferHeader = document.createElement('div');
    bufferHeader.style.display = 'flex';
    this.tile.appendChild(bufferHeader);
    const settingsDiv = document.createElement('div');
    settingsDiv.style.display = 'flex';
    bufferHeader.appendChild(settingsDiv);

    // Create settings behavior
    settingsDiv.appendChild(
      createSettingsButton('RED', 22.025, dispSettings.red, function () {
        dispSettings.red = !dispSettings.red;
        updateBurn(table, dispSettings);
        pmmgSettings['PMMGExtended']['burn_settings'][bufferName] = dispSettings;

        setSettings(pmmgSettings);
      }),
    );
    settingsDiv.appendChild(
      createSettingsButton('YELLOW', 40.483, dispSettings.yellow, function () {
        dispSettings.yellow = !dispSettings.yellow;
        updateBurn(table, dispSettings);
        pmmgSettings['PMMGExtended']['burn_settings'][bufferName] = dispSettings;

        setSettings(pmmgSettings);
      }),
    );
    settingsDiv.appendChild(
      createSettingsButton('GREEN', 34.65, dispSettings.green, function () {
        dispSettings.green = !dispSettings.green;
        updateBurn(table, dispSettings);
        pmmgSettings['PMMGExtended']['burn_settings'][bufferName] = dispSettings;

        setSettings(pmmgSettings);
      }),
    );
    settingsDiv.appendChild(
      createSettingsButton('INF', 19.6, dispSettings.inf, function () {
        dispSettings.inf = !dispSettings.inf;
        updateBurn(table, dispSettings);
        pmmgSettings['PMMGExtended']['burn_settings'][bufferName] = dispSettings;

        setSettings(pmmgSettings);
      }),
    );

    const head = document.createElement('thead');
    const headRow = document.createElement('tr');
    head.appendChild(headRow);
    table.appendChild(head);

    const isMultiplanet = parameters[2] || parameters[1].toLowerCase() == 'all';

    for (const title of ['Needs', 'Production', 'Inv', 'Amt. Needed', 'Burn']) {
      const header = document.createElement('th');
      header.textContent = title;
      header.style.paddingTop = '0';
      headRow.appendChild(header);
    }
    (headRow.firstChild as HTMLTableCellElement).colSpan = 2;

    planetBurn.forEach(burn => {
      const body = document.createElement('tbody');
      table.appendChild(body);

      if (isMultiplanet) {
        const nameRow = document.createElement('tr');
        const nameRowColumn = document.createElement('td');

        const isMinimized = dispSettings.minimized && dispSettings.minimized[burn.planetName];
        const minimizeButton = document.createElement('div');
        minimizeButton.textContent = isMinimized ? '+' : '-';
        minimizeButton.classList.add('pb-burn-minimize');
        nameRowColumn.appendChild(minimizeButton);

        minimizeButton.addEventListener('click', function () {
          if (!dispSettings.minimized) {
            dispSettings.minimized = {};
          }

          if (dispSettings.minimized[burn.planetName]) {
            delete dispSettings.minimized[burn.planetName];
            minimizeButton.textContent = '-';
          } else {
            dispSettings.minimized[burn.planetName] = true;
            minimizeButton.textContent = '+';
          }
          updateBurn(table, dispSettings);
          pmmgSettings['PMMGExtended']['burn_settings'][bufferName] = dispSettings;

          setSettings(pmmgSettings);
        });

        nameRowColumn.colSpan = 5;
        nameRowColumn.appendChild(createTextSpan(burn.planetName));
        nameRowColumn.classList.add('title');
        nameRowColumn.style.display = 'table-cell';
        nameRowColumn.style.backgroundColor = 'rgba(1, 1, 1, 0)';
        nameRow.appendChild(nameRowColumn);
        body.appendChild(nameRow);

        // Add column for burn days for planet
        let minDaysLeft = 1000;
        Object.keys(burn.burn).forEach(mat => {
          if (
            !isNaN(burn.burn[mat]['DailyAmount']) &&
            burn.burn[mat]['DailyAmount'] < 0 &&
            burn.burn[mat]['DaysLeft'] < minDaysLeft
          ) {
            minDaysLeft = burn.burn[mat]['DaysLeft'];
          }
        });

        const burnColumn = document.createElement('td');
        burnColumn.appendChild(
          createTextSpan(
            (minDaysLeft < 500
              ? Math.floor(minDaysLeft).toLocaleString(undefined, { maximumFractionDigits: 0 })
              : '∞') + ' Days',
          ),
        );
        if (minDaysLeft >= 500) {
          burnColumn.classList.add('burn-green-no-hover');
          burnColumn.classList.add('burn-infinite');
        } else if (minDaysLeft <= (this.pmmgSettings['PMMGExtended']['burn_thresholds'] || [3, 7])[0]) {
          burnColumn.classList.add('burn-red-no-hover');
        } else if (minDaysLeft <= (this.pmmgSettings['PMMGExtended']['burn_thresholds'] || [3, 7])[1]) {
          burnColumn.classList.add('burn-yellow-no-hover');
        } else {
          burnColumn.classList.add('burn-green-no-hover');
        }

        nameRow.appendChild(burnColumn);
        nameRow.style.borderBottom = '1px solid #2b485a';
      }

      const burnMaterials = Object.keys(burn.burn);
      burnMaterials.sort(CategorySort);

      for (const ticker of burnMaterials) {
        const row = document.createElement('tr');
        body.appendChild(row);
        const materialColumn = document.createElement('td');
        materialColumn.style.width = '32px';
        materialColumn.style.paddingRight = '0px';
        materialColumn.style.paddingLeft = isMultiplanet ? '32px' : '0px';
        const matElem = createMaterialElement(ticker, 'prun-remove-js', 'none', false, true);
        if (matElem) {
          materialColumn.appendChild(matElem);
        }
        row.appendChild(materialColumn);
        const nameSpan = createTextSpan(materials.get(ticker)?.displayName);
        nameSpan.style.fontWeight = 'bold';
        const nameColumn = document.createElement('td');
        nameColumn.appendChild(nameSpan);
        row.appendChild(nameColumn);

        const consColumn = document.createElement('td');
        consColumn.appendChild(
          createTextSpan(
            burn.burn[ticker]['DailyAmount'].toLocaleString(undefined, {
              maximumFractionDigits: Math.abs(burn.burn[ticker]['DailyAmount']) < 1 ? 2 : 1,
              minimumFractionDigits: Math.abs(burn.burn[ticker]['DailyAmount']) < 1 ? 2 : undefined,
            }) + ' / Day',
          ),
        );
        row.appendChild(consColumn);

        const invColumn = document.createElement('td');
        const invAmount = burn.burn[ticker]['Inventory'] == undefined ? 0 : burn.burn[ticker]['Inventory'];
        invColumn.appendChild(createTextSpan(invAmount.toLocaleString(undefined)));
        row.appendChild(invColumn);

        const burnDays = burn.burn[ticker]['DaysLeft'];
        const burnColumn = document.createElement('td');
        burnColumn.appendChild(
          createTextSpan(
            (burnDays != '∞' && burnDays < 500 && burn.burn[ticker]['DailyAmount'] < 0
              ? Math.floor(burnDays).toLocaleString(undefined, { maximumFractionDigits: 0 })
              : '∞') + ' Days',
          ),
        );
        if (burn.burn[ticker]['DailyAmount'] >= 0) {
          burnColumn.classList.add('burn-green');
          burnColumn.classList.add('burn-infinite');
        } else if (burnDays <= (this.pmmgSettings['PMMGExtended']['burn_thresholds'] || [3, 7])[0]) {
          burnColumn.classList.add('burn-red');
        } else if (burnDays <= (this.pmmgSettings['PMMGExtended']['burn_thresholds'] || [3, 7])[1]) {
          burnColumn.classList.add('burn-yellow');
        } else {
          burnColumn.classList.add('burn-green');
        }

        const needColumn = document.createElement('td');
        const needAmt =
          burnDays >
            (this.pmmgSettings['PMMGExtended']['burn_thresholds'] || [3, 7])[1] +
              (this.pmmgSettings['PMMGExtended']['burn_green_buffer'] || 7) || burn.burn[ticker]['DailyAmount'] > 0
            ? 0
            : (burnDays -
                (this.pmmgSettings['PMMGExtended']['burn_thresholds'] || [3, 7])[1] -
                (this.pmmgSettings['PMMGExtended']['burn_green_buffer'] || 7)) *
              burn.burn[ticker]['DailyAmount'];
        needColumn.appendChild(
          createTextSpan(isNaN(needAmt) ? '0' : needAmt.toLocaleString(undefined, { maximumFractionDigits: 0 })),
        );

        row.appendChild(needColumn);
        row.appendChild(burnColumn);
      }
    });

    updateBurn(table, dispSettings);
    this.tile.appendChild(table);

    this.update_buffer();
    return;
  }

  update_buffer() {
    this.alive = document.body.contains(this.tile);
    if (this.alive) {
      window.setTimeout(() => this.create_buffer(), 3000);
    }
  }

  destroy_buffer() {
    // Nothing constantly running so nothing to destroy
  }
}

function internalCalculateBurn(parameters, userInfo) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const planetBurn = [] as any[];

  if (!parameters[1] || parameters[1].toLowerCase() == 'all') {
    userInfo['PMMG-User-Info']['workforce'].forEach(planetWorkforce => {
      if (!planetWorkforce.PlanetName) {
        return;
      }

      // Calculate burn for each planet
      const production = findCorrespondingPlanet(planetWorkforce.PlanetName, userInfo['PMMG-User-Info']['production']);
      const workforce = findCorrespondingPlanet(planetWorkforce.PlanetName, userInfo['PMMG-User-Info']['workforce']);
      const inv = findCorrespondingPlanet(planetWorkforce.PlanetName, userInfo['PMMG-User-Info']['storage'], true);

      planetBurn.push({ burn: calculateBurn(production, workforce, inv), planetName: planetWorkforce.PlanetName });
    });
  } else {
    for (let i = 1; i < parameters.length; i++) {
      // Calculate burn for each planet
      const production = findCorrespondingPlanet(parameters[i], userInfo['PMMG-User-Info']['production']);
      const workforce = findCorrespondingPlanet(parameters[i], userInfo['PMMG-User-Info']['workforce']);
      const inv = findCorrespondingPlanet(parameters[i], userInfo['PMMG-User-Info']['storage'], true);

      planetBurn.push({ burn: calculateBurn(production, workforce, inv), planetName: parameters[i] });
    }
  }

  // If more than 1 planet, make "overall" category
  if (planetBurn.length > 1) {
    const overallBurn = {};
    planetBurn.forEach(burn => {
      Object.keys(burn.burn).forEach(mat => {
        if (overallBurn[mat]) {
          overallBurn[mat].DailyAmount += burn.burn[mat].DailyAmount;
          overallBurn[mat].Inventory += burn.burn[mat].Inventory;
        } else {
          overallBurn[mat] = {};
          overallBurn[mat].DailyAmount = burn.burn[mat].DailyAmount;
          overallBurn[mat].Inventory = burn.burn[mat].Inventory;
        }
      });
    });

    Object.keys(overallBurn).forEach(mat => {
      if (overallBurn[mat].DailyAmount >= 0) {
        overallBurn[mat].DaysLeft = 1000;
      } else {
        overallBurn[mat].DaysLeft = -overallBurn[mat].Inventory / overallBurn[mat].DailyAmount;
      }
    });

    planetBurn.push({ burn: overallBurn, planetName: 'Overall' });
  }

  planetBurn.sort(burnPlanetSort);

  return planetBurn;
}

// Sort entries in planetBurn like the game does it
function burnPlanetSort(a, b) {
  if (a.planetName == 'Overall') {
    return 1;
  }
  if (b.planetName == 'Overall') {
    return -1;
  }

  return comparePlanets(a.planetName, b.planetName);
}

function updateBurn(table, dispSettings) {
  (Array.from(table.children) as HTMLElement[]).forEach(child => {
    if (!child.children) {
      return;
    }

    // Hide further elements if minimized
    if (child && child.children[0] && !child.children[0].children[5]) {
      // Is header row
      const planetSpan = child.children[0].querySelector('span');
      if (planetSpan) {
        const planet = planetSpan.textContent;
        const minimized = planet && dispSettings.minimized && dispSettings.minimized[planet];
        for (let i = 1; i < child.children.length; i++) {
          const row = child.children[i] as HTMLElement;
          row.style.display = !minimized ? 'table-row' : 'none';
          row.style.visibility = !minimized ? 'visible' : 'hidden';
          row.style.width = !minimized ? 'auto' : '0px';
          row.style.height = !minimized ? 'auto' : '0px';
        }

        if (minimized) {
          return;
        }
      }
    }

    (Array.from(child.children) as HTMLElement[]).forEach(row => {
      if (!row.children || !row.children[5]) {
        return;
      }

      if (row.children[5].classList.contains('burn-infinite')) {
        row.style.display = dispSettings.inf ? 'table-row' : 'none';
        row.style.visibility = dispSettings.inf ? 'visible' : 'hidden';
        row.style.width = dispSettings.inf ? 'auto' : '0px';
        row.style.height = dispSettings.inf ? 'auto' : '0px';
      } else if (row.children[5].classList.contains('burn-green')) {
        row.style.display = dispSettings.green ? 'table-row' : 'none';
        row.style.visibility = dispSettings.green ? 'visible' : 'hidden';
        row.style.width = dispSettings.green ? 'auto' : '0px';
        row.style.height = dispSettings.green ? 'auto' : '0px';
      } else if (row.children[5].classList.contains('burn-yellow')) {
        row.style.display = dispSettings.yellow ? 'table-row' : 'none';
        row.style.visibility = dispSettings.yellow ? 'visible' : 'hidden';
        row.style.width = dispSettings.yellow ? 'auto' : '0px';
        row.style.height = dispSettings.yellow ? 'auto' : '0px';
      } else if (row.children[5].classList.contains('burn-red')) {
        row.style.display = dispSettings.red ? 'table-row' : 'none';
        row.style.visibility = dispSettings.red ? 'visible' : 'hidden';
        row.style.width = dispSettings.red ? 'auto' : '0px';
        row.style.height = dispSettings.red ? 'auto' : '0px';
      }
    });
  });
  return;
}
