import { createTextSpan, clearChildren, setSettings } from "../util";
import { NonProductionBuildings } from "../GameProperties";


// This entire module is really, really messy and needs to be rewritten.
export class Repairs {
  private tile: HTMLElement;
  private parameters: string[];
  private pmmgSettings;
  private userInfo;
  public name = "REPAIRS";

  constructor(tile, parameters, pmmgSettings, userInfo) {
    this.tile = tile;
    this.parameters = parameters;
    this.pmmgSettings = pmmgSettings;
    this.userInfo = userInfo;
  }

  create_buffer() {
    // Declare class parameters in static context
    const pmmgSettings = this.pmmgSettings;

    clearChildren(this.tile);
    if (!this.userInfo["PMMG-User-Info"] || !this.userInfo["PMMG-User-Info"]["sites"] || !this.userInfo["PMMG-User-Info"]["ships"]) {
      this.tile.textContent = "Loading Repair Data...";
      this.tile.id = "pmmg-reload";
      return;
    }

    const ships = this.userInfo["PMMG-User-Info"]["ships"];

    // Generate repairs screen for all things
    if (this.parameters.length < 2)	// What even does all this code do?
    {
      const title = createTextSpan("All Repairs");
      title.classList.add("title");
      this.tile.appendChild(title);

      const inputDiv = document.createElement("div");
      this.tile.appendChild(inputDiv);

      const thresholdDiv = document.createElement("div");
      thresholdDiv.style.display = "inline";
      inputDiv.appendChild(thresholdDiv);

      const thresholdInput = document.createElement("input");
      thresholdInput.classList.add("input-text");
      const thresholdText = createTextSpan("Age Threshold:");
      thresholdText.style.paddingLeft = "5px";
      thresholdInput.type = "number";
      thresholdInput.value = this.pmmgSettings["PMMGExtended"]["repair_threshold"] ? this.pmmgSettings["PMMGExtended"]["repair_threshold"] : "70";
      thresholdInput.style.width = "60px";
      thresholdDiv.appendChild(thresholdText);
      thresholdDiv.appendChild(thresholdInput);

      const offsetDiv = document.createElement("div");
      offsetDiv.style.display = "inline";
      inputDiv.appendChild(offsetDiv);

      const offsetInput = document.createElement("input");
      offsetInput.classList.add("input-text");
      const offsetText = createTextSpan("Time Offset:");
      offsetText.style.paddingLeft = "5px";
      offsetInput.type = "number";
      offsetInput.value = this.pmmgSettings["PMMGExtended"]["repair_offset"] ? this.pmmgSettings["PMMGExtended"]["repair_offset"] : "0";
      offsetInput.style.width = "60px";
      offsetDiv.appendChild(offsetText);
      offsetDiv.appendChild(offsetInput);

      const matTitle = createTextSpan("Shopping Cart");
      matTitle.classList.add("title");
      matTitle.style.paddingBottom = "2px";
      this.tile.appendChild(matTitle);
      const matDiv = document.createElement("div");
      this.tile.appendChild(matDiv);
      const buiTitle = createTextSpan("Buildings");
      buiTitle.classList.add("title");
      buiTitle.style.paddingTop = "5px";
      buiTitle.style.paddingBottom = "2px";
      this.tile.appendChild(buiTitle);
      const table = document.createElement("table");

      const head = document.createElement("thead");
      const hr = document.createElement("tr");
      head.appendChild(hr);
      table.appendChild(head);
      this.tile.appendChild(table);
      for (let t of ["Ticker", "Planet", "Age", "Condition"]) {
        const header = document.createElement("th");
        header.textContent = t;
        header.style.paddingTop = "0";
        hr.appendChild(header);
      }
      var buildings = [] as any[];
      this.userInfo["PMMG-User-Info"]["sites"].forEach(site => {
        if (site.type != "BASE") {
          return;
        }

        site.buildings.forEach(build => {
          buildings.push([site["PlanetName"], build]);
          return;
        });
        return;
      });
      buildings.sort(buildingSort);

      const body = document.createElement("tbody");
      table.appendChild(body);
      generateGeneralRepairScreen(body, matDiv, buildings, ships, thresholdInput, offsetInput, true, false);

      thresholdInput.addEventListener("input", function () {
        clearChildren(body);

        generateGeneralRepairScreen(body, matDiv, buildings, ships, thresholdInput, offsetInput, true, false);
        pmmgSettings["PMMGExtended"]["repair_threshold"] = thresholdInput.value || "70";
        setSettings(pmmgSettings);
      });

      offsetInput.addEventListener("input", function () {
        clearChildren(body);

        generateGeneralRepairScreen(body, matDiv, buildings, ships, thresholdInput, offsetInput, true, false);
        pmmgSettings["PMMGExtended"]["repair_offset"] = offsetInput.value || "0";
        setSettings(pmmgSettings);
      });
    } else	// Generate repairs screen for single base or ships
    {
      const screenName = this.parameters[1].toUpperCase();
      const title = createTextSpan(this.parameters[1] + " Repairs");
      title.classList.add("title");
      this.tile.appendChild(title);

      var siteData = [] as any[];
      this.userInfo["PMMG-User-Info"]["sites"].forEach(site => {
        if (site.type == "BASE" && (site["PlanetName"].toUpperCase() == screenName || site["PlanetNaturalId"].toUpperCase() == screenName) && site.buildings) {
          site.buildings.forEach(building => {
            siteData.push([this.parameters[1], building]);
          });
        }
        return;
      });

      const inputDiv = document.createElement("div");
      this.tile.appendChild(inputDiv);

      const thresholdDiv = document.createElement("div");
      thresholdDiv.style.display = "inline";
      inputDiv.appendChild(thresholdDiv);

      const thresholdInput = document.createElement("input");
      thresholdInput.classList.add("input-text");
      const thresholdText = createTextSpan("Age Threshold:");
      thresholdText.style.paddingLeft = "5px";
      thresholdInput.type = "number";
      thresholdInput.value = this.pmmgSettings["PMMGExtended"]["repair_threshold"] ? this.pmmgSettings["PMMGExtended"]["repair_threshold"] : "70";
      thresholdInput.style.width = "60px";
      thresholdDiv.appendChild(thresholdText);
      thresholdDiv.appendChild(thresholdInput);

      const offsetDiv = document.createElement("div");
      offsetDiv.style.display = "inline";
      inputDiv.appendChild(offsetDiv);

      const offsetInput = document.createElement("input");
      offsetInput.classList.add("input-text");
      const offsetText = createTextSpan("Time Offset:");
      offsetText.style.paddingLeft = "5px";
      offsetInput.type = "number";
      offsetInput.value = this.pmmgSettings["PMMGExtended"]["repair_offset"] ? this.pmmgSettings["PMMGExtended"]["repair_offset"] : "0";
      offsetInput.style.width = "60px";
      offsetDiv.appendChild(offsetText);
      offsetDiv.appendChild(offsetInput);

      const matTitle = createTextSpan("Shopping Cart");
      matTitle.classList.add("title");
      matTitle.style.paddingBottom = "2px";
      this.tile.appendChild(matTitle);
      const matDiv = document.createElement("div");
      this.tile.appendChild(matDiv);
      const buiTitle = createTextSpan("Buildings");
      buiTitle.classList.add("title");
      buiTitle.style.paddingTop = "5px";
      buiTitle.style.paddingBottom = "2px";
      this.tile.appendChild(buiTitle);
      const table = document.createElement("table");

      const head = document.createElement("thead");
      const hr = document.createElement("tr");
      head.appendChild(hr);
      table.appendChild(head);
      this.tile.appendChild(table);
      for (let t of screenName == "SHIP" || screenName == "SHIPS" ? ["Ticker", "Condition"] : ["Ticker", "Age", "Condition"]) {
        const header = document.createElement("th");
        header.textContent = t;
        header.style.paddingTop = "0";
        hr.appendChild(header);
      }
      siteData.sort(buildingSort);

      const body = document.createElement("tbody");
      table.appendChild(body);
      generateGeneralRepairScreen(body, matDiv, siteData, ships, thresholdInput, offsetInput, false, screenName == "SHIP" || screenName == "SHIPS");

      thresholdInput.addEventListener("input", function () {
        clearChildren(body);

        generateGeneralRepairScreen(body, matDiv, siteData, ships, thresholdInput, offsetInput, false, screenName == "SHIP" || screenName == "SHIPS");
        pmmgSettings["PMMGExtended"]["repair_threshold"] = thresholdInput.value || "70";
        setSettings(pmmgSettings);
      });

      offsetInput.addEventListener("input", function () {
        clearChildren(body);

        generateGeneralRepairScreen(body, matDiv, siteData, ships, thresholdInput, offsetInput, false, screenName == "SHIP" || screenName == "SHIPS");
        pmmgSettings["PMMGExtended"]["repair_offset"] = offsetInput.value || "0";
        setSettings(pmmgSettings);
      });
    }
    return;
  }

  update_buffer() {
    // Nothing to update
  }

  destroy_buffer() {
    // Nothing constantly running so nothing to destroy
  }
}

function generateGeneralRepairScreen(body, matDiv, buildings, ships, thresholdInput, offsetInput, isGlobal, shipsOnly) 	// Buildings is an array of type: [planetName, buildingInfo]
{
  const materials = {};

  if (!buildings || !ships) {
    return;
  }

  if (!shipsOnly)	// Add buildings to the list
  {
    buildings.forEach(buildingInfo => {
      const planet = buildingInfo[0];
      const building = buildingInfo[1];

      if (NonProductionBuildings.includes(building["buildingTicker"])) {
        return;
      }

      const date = (((new Date()).getTime() - building.lastRepair) / 86400000);
      if (date < parseFloat(thresholdInput.value || "0") - parseFloat(offsetInput.value || "0")) {
        return;
      }

      // Generate row showing current building %
      const buildingRow = document.createElement("tr");
      body.appendChild(buildingRow);

      var rowData;
      if (isGlobal) {
        rowData = [building["buildingTicker"], planet, date.toLocaleString(undefined, { maximumFractionDigits: 1 }), (building["condition"] * 100).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "%"];
      } else {
        rowData = [building["buildingTicker"], date.toLocaleString(undefined, { maximumFractionDigits: 1 }), (building["condition"] * 100).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "%"];
      }

      rowData.forEach(data => {
        const tableElem = document.createElement("td");
        buildingRow.appendChild(tableElem);
        tableElem.appendChild(createTextSpan(data));
      });

      // Calculate shopping cart
      const buildingMaterials = {};
      building.reclaimableMaterials.forEach(mat => {
        const amount = mat.amount;
        const ticker = mat.material.ticker;
        if (buildingMaterials[ticker]) {
          buildingMaterials[ticker] += amount;
        } else {
          buildingMaterials[ticker] = amount;
        }
      });
      building.repairMaterials.forEach(mat => {
        const amount = mat.amount;
        const ticker = mat.material.ticker;
        if (buildingMaterials[ticker]) {
          buildingMaterials[ticker] += amount;
        } else {
          buildingMaterials[ticker] = amount;
        }
      });

      //console.log(building);
      const adjustedDate = date + parseFloat(offsetInput.value || "0");

      Object.keys(buildingMaterials).forEach(ticker => {
        const amount = adjustedDate > 180 ? buildingMaterials[ticker] : Math.ceil(buildingMaterials[ticker] * adjustedDate / 180);	// This isn't quite right, but will be off by only 1 MCG at most

        if (materials[ticker]) {
          materials[ticker] += amount;
        } else {
          materials[ticker] = amount;
        }
      });

    });
  }

  // Add ships to the list
  if (isGlobal || shipsOnly) {
    ships.forEach(ship => {
      if (ship.condition < 0.85) {
        // Generate row showing current ship %
        const shipRow = document.createElement("tr");
        body.appendChild(shipRow);

        var rowData;
        if (shipsOnly) {
          rowData = [ship.name || ship.registration, (ship.condition * 100).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "%"];
        } else {
          rowData = [ship.name || ship.registration, "-", "-", (ship.condition * 100).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "%"];
        }

        rowData.forEach(data => {
          const tableElem = document.createElement("td");
          shipRow.appendChild(tableElem);
          tableElem.appendChild(createTextSpan(data));
        });

        // Calculate Shopping Cart
        if (ship.repairMaterials) {
          ship.repairMaterials.forEach(mat => {
            const ticker = mat.material.ticker;
            if (materials[ticker]) {
              materials[ticker] += mat.amount;
            } else {
              materials[ticker] = mat.amount;
            }
          });
        }
      }
    });
  }

  //console.log(materials);

  // Display shopping cart
  clearChildren(matDiv);
  matDiv.style.maxWidth = "200px";

  const table = document.createElement("table");
  matDiv.appendChild(table);
  const head = document.createElement("thead");
  const hr = document.createElement("tr");
  head.appendChild(hr);
  table.appendChild(head);
  for (let t of ["Material", "Amount"]) {
    const header = document.createElement("th");
    header.textContent = t;
    header.style.paddingTop = "0";
    hr.appendChild(header);
  }
  const mbody = document.createElement("tbody");
  table.appendChild(mbody);
  Object.keys(materials).sort().forEach(mat => {
    const row = document.createElement("tr");
    mbody.appendChild(row);
    var rowData = [mat, materials[mat].toLocaleString(undefined)];
    for (let point of rowData) {
      const tableElem = document.createElement("td");
      row.appendChild(tableElem);
      tableElem.appendChild(createTextSpan(point));
    }
    return;
  });
  return;
}

function buildingSort(a, b) {
  return a[1]["condition"] > b[1]["condition"] ? 1 : -1;
}
