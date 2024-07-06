import { Module } from "./ModuleRunner";
import { getBuffersFromList, createTextSpan } from "./util";
import { Selector } from "./Selector";
/*import {Start} from "./XIT/Start";
import {Settings} from "./XIT/Settings";
import {Debug} from "./XIT/Debug";
import {Calculator} from "./XIT/Calculator";
import {Repairs_pre} from "./XIT/Repairs";
import {Chat_pre} from "./XIT/Chat";
import {Fin_pre} from "./XIT/Finances";
import {EnhancedBurn_pre} from "./XIT/Burn";
import {Contracts_pre} from "./XIT/Contracts";
import {PRuN_pre, Prosperity_pre, Sheets_pre, Discord_pre, PrunPlanner, Wiki, FIO} from "./XIT/Web";
import {FIOInv_pre} from "./XIT/Inventory";
import {Notes} from "./XIT/Notes";
import {Checklists} from "./XIT/Checklists";
import {Sort} from "./XIT/Sort";
import {CommandLists} from "./XIT/CommandLists";
import {Help} from "./XIT/Help";
import {DataHealth} from "./XIT/DataHealth";*/
import { FIOInventory } from "./XIT/Inventory";
import { FIOChat } from "./XIT/Chat";
import { Calculator } from "./XIT/Calculator";
import { DataHealth } from "./XIT/DataHealth";
import { Burn } from "./XIT/Burn";
import { Contracts } from "./XIT/Contracts";
import { CommandLists } from "./XIT/CommandLists";
import { Debug } from "./XIT/Debug";
import { Finances } from "./XIT/Finances";
import { Help } from "./XIT/Help";
import { Repairs } from "./XIT/Repairs";
import { Settings } from "./XIT/Settings";
import { Sort } from "./XIT/Sort";
import { Start } from "./XIT/Start";
import { PrUN, Prosperity, Sheets, Wiki, PrunPlanner, Map } from "./XIT/Web";
import { Checklists } from "./XIT/Checklists";
import { Execute } from "./XIT/Execute";
import { Notes } from "./XIT/Notes";
import { CHROME } from "./env";

// This is the structure all classes should follow. For some reason extending classes in other files shows XITModule as undefined.
// Not the best solution, but it works. Be careful implementing new modules that they include these functions.
export abstract class XITModule {
  abstract create_buffer();	// Clear and recreate the buffer
  abstract update_buffer();	// Partially update the buffer
  abstract destroy_buffer();	// Destroys any continuous objects not automatically destroyed on buffer close
  abstract name: string;		// Title of the buffer
}

const XITClasses: { [key: string]: new(...args: any[]) => XITModule } = {
  "INV": FIOInventory,
  "CALCULATOR": Calculator,
  "CALC": Calculator,
  "CHAT": FIOChat,
  "HEALTH": DataHealth,
  "BURN": Burn,
  "CONTS": Contracts,
  "CONTRACTS": Contracts,
  "LIST": CommandLists,
  "LISTS": CommandLists,
  "DEBUG": Debug,
  "FIN": Finances,
  "FINANCE": Finances,
  "FINANCES": Finances,
  "HELP": Help,
  "REPAIRS": Repairs,
  "SET": Settings,
  "SETTINGS": Settings,
  "SORT": Sort,
  "START": Start,
  "PRUN": PrUN,
  "PROSPERITY": Prosperity,
  "SHEET": Sheets,
  "SHEETS": Sheets,
  "WIKI": Wiki,
  "PLANNER": PrunPlanner,
  "PLAN": PrunPlanner,
  "PRUNPLANNER": PrunPlanner,
  "CHECK": Checklists,
  "CHECKLIST": Checklists,
  "CHECKLISTS": Checklists,
  "NOTE": Notes,
  "NOTES": Notes,
  "ACT": Execute,
  "ACTION": Execute,
  "MAP": Map
};


/**
 * Handle XIT buffers
 */
export class XITHandler implements Module {
  private tag = "pb-xit";
  private webData;
  private modules;
  private pmmgSettings;
  private userInfo;

  constructor(pmmgSettings, userInfo, webData, modules) {
    this.userInfo = userInfo;
    this.webData = webData;
    this.modules = modules;
    this.pmmgSettings = pmmgSettings;
  }

  cleanup() {
    //genericCleanup(this.tag);	// Don't clean up because causes flashing when doing asynchronous requests
  }

  run(buffers) {
    const matchingBuffers = getBuffersFromList("XIT", buffers);
    if (!matchingBuffers) return;
    matchingBuffers.forEach(buffer => {
      const tile = (buffer.querySelector(Selector.XITTile)) as HTMLElement;
      if (!tile) {
        return;
      }

      if (tile.firstChild && ((tile.firstChild as HTMLElement).id == "pmmg-load-success" || (tile.firstChild as HTMLElement).id == "pmmg-no-match")) {
        return;
      }
      const header = buffer.querySelector(Selector.BufferHeader);
      if (!header) {
        return;
      }

      const parametersRaw = header.textContent;

      if (!parametersRaw) return;
      var parameters = [] as string[];
      if (parametersRaw.charAt(4) == "1") {
        const keyValues = parametersRaw.slice(4).split(" ");
        keyValues.forEach(key => {
          parameters.push(key.slice(2));
          return;
        });
      } else {
        parameters = parametersRaw.slice(4).split("_");
      }
      if (!parameters) return;
      for (var i = 0; i < parameters.length; i++) {
        parameters[i] = parameters[i].trim();
      }

      if (parameters[0] && parameters[0].toUpperCase() == "FIO")	// Exception for FIO to use XIT
      {
        return;
      }

      tile.classList.add("xit-tile");
      if (tile.firstChild) {
        (tile.firstChild as HTMLElement).style.backgroundColor = "#222222";
      }

      const refreshButton = document.createElement("div");
      if (!tile.firstChild || (tile.firstChild && ((tile.firstChild as HTMLElement).id != "pmmg-no-match")))	// Add refresh button if one hasn't been added
      {
        if (buffer.getElementsByClassName("refresh").length == 0) {
          refreshButton.appendChild(createTextSpan("⟳"));
          refreshButton.classList.add("button-upper-right");
          refreshButton.classList.add(this.tag);
          refreshButton.style.fontSize = "16px";
          refreshButton.style.paddingTop = CHROME ? "12px" : "7px";
          refreshButton.classList.add("refresh");
          (buffer.children[3] || buffer.children[2]).insertBefore(refreshButton, (buffer.children[3] || buffer.children[2]).firstChild);
        }
      }
      const contentDiv = document.createElement("div");
      contentDiv.style.height = "100%";
      contentDiv.style.flexGrow = "1";

      tile.appendChild(contentDiv);

      if (!XITClasses[parameters[0].toUpperCase()])	// If not a valid command
      {
        tile.textContent = "Error! No Matching Function!";
        if (!tile.firstChild) {
          return;
        }
        (tile.firstChild as HTMLElement).id = "pmmg-no-match";
      } else {
        (tile.firstChild as HTMLElement).id = "pmmg-load-success";
        const XITObj = new XITClasses[parameters[0].toUpperCase()](contentDiv, parameters, this.pmmgSettings, this.userInfo, this.webData, this.modules);	// Make new XIT object
        refreshButton.addEventListener("click", function () {
          XITObj.create_buffer();
        });	// Add refresh listener
        (buffer.querySelector(Selector.BufferTitle) as HTMLElement).textContent = XITObj.name;	// Title the buffer
        XITObj.create_buffer();

      }
      return;

    });
    return;
  }


}
