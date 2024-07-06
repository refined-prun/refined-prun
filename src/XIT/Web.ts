import { clearChildren } from "../util";

export class PrUN {
  private tile: HTMLElement;
  public name = "PRUN-CEPTION";

  constructor(tile) {
    this.tile = tile;
  }

  create_buffer() {
    clearChildren(this.tile);
    const prun = document.createElement("iframe");
    prun.src = "https://apex.prosperousuniverse.com/#/";
    prun.width = "100%";
    prun.height = "100%";
    prun.style.borderWidth = "0";
    this.tile.appendChild(prun);
    return;
  }

  update_buffer() {
    // Nothing to update
  }

  destroy_buffer() {
    // Nothing constantly running so nothing to destroy
  }
}

export class Prosperity {
  private tile: HTMLElement;
  private parameters: string[];
  public name = "PROSPERITY";

  constructor(tile, parameters) {
    this.tile = tile;
    this.parameters = parameters;
  }

  create_buffer() {
    clearChildren(this.tile);
    var url = "https://prosperity-prun.netlify.app/";
    if (this.parameters.length == 3) {
      url += "?from=" + this.parameters[1] + "&to=" + this.parameters[2];
    }

    const prosp = document.createElement("iframe");
    prosp.src = url;
    prosp.width = "100%";
    prosp.height = "100%";
    prosp.style.borderWidth = "0";
    this.tile.appendChild(prosp);
    return;
  }

  update_buffer() {
    // Nothing to update
  }

  destroy_buffer() {
    // Nothing constantly running so nothing to destroy
  }
}

export class Sheets {
  private tile: HTMLElement;
  private parameters: string[];
  public name = "GOOGLE SHEETS";

  constructor(tile, parameters) {
    this.tile = tile;
    this.parameters = parameters;
  }

  create_buffer() {
    clearChildren(this.tile);
    if (this.parameters.length < 2) {
      this.tile.textContent = "Error! Not Enough Parameters!";
      return;
    }
    for (var i = 2; i < this.parameters.length; i++) {
      this.parameters[1] += "_" + this.parameters[i];
    }
    const sheet = document.createElement("iframe");
    sheet.src = "https://docs.google.com/spreadsheets/d/" + this.parameters[1] + "/edit?usp=sharing";
    sheet.style.borderWidth = "0";
    sheet.style.height = "100%";
    sheet.style.width = "100%";
    this.tile.appendChild(sheet);
    return;
  }

  update_buffer() {
    // Nothing to update
  }

  destroy_buffer() {
    // Nothing constantly running so nothing to destroy
  }
}

/* // All Discord server stuff is broken. Changes to widgetbot? Not many people seem to use it so I'll remove it for the time being.
const DiscordServers = {
	"UFO": ["855488309802172469", "855489711635431475"],
	"FIOC": ["807992640247300116", "808451512351195166"],
	"AHI": ["704907707634941982", "797157877324185650"],
	"PCT": ["667551433503014924", "667551433503014927"]
}

export function Discord_pre(tile, parameters)
{
	clearChildren(tile);
	var serverID;
	var channelID;
	if(parameters.length == 2)
	{
		if(DiscordServers[parameters[1]] == undefined)
		{
			tile.textContent = "Error! Not Enough Parameters";
			return;
		}
		else
		{
			serverID = DiscordServers[parameters[1]][0];
			channelID = DiscordServers[parameters[1]][1];
		}
	}
	else if(parameters.length > 2)
	{
		serverID = parameters[1];
		channelID = parameters[2];
	}
	else
	{
		tile.textContent = "Error! Not Enough Parameters";
		return;
	}
	const discord = document.createElement("iframe");
		discord.src = "https://e.widgetbot.io/channels/" + serverID + "/" + channelID;
		discord.width = "100%";
		discord.height = "100%";
		discord.style.borderWidth = "0px";
				
	tile.appendChild(discord);
	return;
}
*/


// Wiki iframe not working right now. Refuses to connect

export class Wiki {
  private tile: HTMLElement;
  private parameters: string[];
  public name = "PRUN WIKI";

  constructor(tile, parameters) {
    this.tile = tile;
    this.parameters = parameters;
  }

  create_buffer() {
    clearChildren(this.tile);
    const frame = document.createElement("iframe");
    frame.src = this.parameters[1] && this.parameters[1].toLowerCase() == "resources" ? "https://handbook.apex.prosperousuniverse.com/wiki/community-resources/index.html" : "https://handbook.apex.prosperousuniverse.com/wiki/index.html";
    frame.style.borderWidth = "0";
    frame.style.height = "100%";
    frame.style.width = "100%";
    this.tile.appendChild(frame);
  }

  update_buffer() {
    // Nothing to update
  }

  destroy_buffer() {
    // Nothing constantly running so nothing to destroy
  }
}

export class PrunPlanner {
  private tile: HTMLElement;
  private parameters: string[];
  public name = "PRUN PLANNER";

  constructor(tile, parameters) {
    this.tile = tile;
    this.parameters = parameters;
  }

  create_buffer() {
    clearChildren(this.tile);
    var link = "https://prunplanner.org";
    for (var i = 1; i < this.parameters.length; i++) {
      link += "/" + this.parameters[i];
    }

    const frame = document.createElement("iframe");
    frame.src = link;
    frame.style.borderWidth = "0";
    frame.style.height = "100%";
    frame.style.width = "100%";
    this.tile.appendChild(frame);
    return;
  }

  update_buffer() {
    // Nothing to update
  }

  destroy_buffer() {
    // Nothing constantly running so nothing to destroy
  }
}

export class Map {
  private tile: HTMLElement;
  public name = "Taiyi's Map";

  constructor(tile) {
    this.tile = tile;
  }

  create_buffer() {
    clearChildren(this.tile);
    const map = document.createElement("iframe");
    map.src = "https://universemap.duckdns.org/";
    map.width = "100%";
    map.height = "100%";
    map.style.borderWidth = "0";
    this.tile.appendChild(map);
    return;
  }

  update_buffer() {
    // Nothing to update
  }

  destroy_buffer() {
    // Nothing constantly running so nothing to destroy
  }
}
