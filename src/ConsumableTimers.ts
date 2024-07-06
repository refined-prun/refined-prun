import { Module } from "./ModuleRunner";
import { parseBaseName, findCorrespondingPlanet, createTextSpan, getBuffersFromList, calculateBurn } from "./util";
import { Selector } from "./Selector";

/**
 * Get inventory and burn data and implement on WF buffers
 */
export class ConsumableTimers implements Module {
  private thresholds;
  private userInfo;

  constructor(thresholds, userInfo) {
    this.thresholds = thresholds;
    this.userInfo = userInfo;
  }

  cleanup() {
    // Nothing to clean up.
    return;
  }

  run(allBuffers) {
    const buffers = getBuffersFromList("WF", allBuffers);

    if (!buffers) {
      return;
    }
    ;

    buffers.forEach(buffer => {
      generateBurns(buffer, this.thresholds || [3, 7], this.userInfo);
    });

    return;
  }


}

export function generateBurns(buffer, thresholds, userInfo) {
  if (!userInfo["PMMG-User-Info"]) {
    return;
  }
  const workforce = userInfo["PMMG-User-Info"]["workforce"];
  const inventories = userInfo["PMMG-User-Info"]["storage"];

  if (buffer.classList.contains("pb-loaded")) {
    return;
  }
  const nameElem = buffer.querySelector(Selector.WorkforceConsumptionTable);
  if (!nameElem || !nameElem.textContent) return;
  const name = parseBaseName(nameElem.textContent);
  if (!name) {
    return;
  }
  const headers = Array.from(buffer.querySelectorAll("table > thead > tr") as HTMLElement[]);
  headers.forEach(header => {
    const totalHeader = header.children[2] as HTMLElement;
    const burnHeader = header.children[3] as HTMLElement;
    totalHeader.textContent = "Total";
    if (burnHeader.children != undefined && burnHeader.children[0] != undefined) {
      burnHeader.removeChild(burnHeader.children[0]);
    }
    burnHeader.textContent = "Burn";
  });

  const planetWorkforce = findCorrespondingPlanet(name, workforce);
  const planetInv = findCorrespondingPlanet(name, inventories, true);

  const planetBurn = calculateBurn(null, planetWorkforce, planetInv);


  const elements = Array.from(buffer.querySelectorAll("table > tbody > tr") as HTMLElement[]);
  elements.forEach(targetRow => {
    if (targetRow.childElementCount < 5) {
      return;
    }
    const outputData = targetRow.children[4] as HTMLElement;
    const totalData = targetRow.children[3] as HTMLElement;
    if (outputData.textContent != "") {
      const ticker = targetRow.children[0].textContent;
      if (!ticker) {
        return;
      }

      const burnAmount = planetBurn[ticker] ? planetBurn[ticker]["DailyAmount"] : 0;
      var daysLeft = planetBurn[ticker] ? planetBurn[ticker]["DaysLeft"] : 0;
      if (burnAmount != 0) {
        if (daysLeft <= thresholds[0]) {
          if (!outputData.classList.contains("burn-red"))
            outputData.classList.add("burn-red");
        } else if (daysLeft <= thresholds[1]) {
          if (!outputData.classList.contains("burn-yellow"))
            outputData.classList.add("burn-yellow");
        } else if (daysLeft >= 500) {
          if (!outputData.classList.contains("burn-green")) {
            outputData.classList.add("burn-green");
            daysLeft = "∞";
          }
        } else {
          if (!outputData.classList.contains("burn-green"))
            outputData.classList.add("burn-green");
        }

        if (!isNaN(daysLeft)) {
          daysLeft = daysLeft.toFixed(0);
        }

        if (daysLeft == 1) {
          daysLeft += " Day";
        } else {
          daysLeft += " Days";
        }
      } else {
        daysLeft = "";
      }
      var firstChild = outputData.firstChild;
      if (firstChild != null) {
        outputData.removeChild(firstChild);
      }
      outputData.appendChild(createTextSpan(daysLeft));

      firstChild = totalData.firstChild;
      if (firstChild != null) {
        totalData.removeChild(firstChild);
      }
      totalData.appendChild(createTextSpan(burnAmount == 0 ? "" : (-burnAmount).toFixed(2)));
    }
  });
  buffer.classList.add("pb-loaded");
  return;
}
