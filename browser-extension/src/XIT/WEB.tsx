import { changeValue } from '../util';
import xit from './xit-registry';
import features from '@src/feature-registry';
import { _$ } from '@src/utils/get-element-by-class-name';
import PrunCss from '@src/prun-ui/prun-css';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';

function WEB(props: { parameters: string[] }) {
  const { parameters } = props;
  if (parameters.length === 0) {
    return null;
  }

  let url = parameters[1];
  if (!isValidUrl(url)) {
    url = parameters.slice(1).map(prunAtob).join();
  }
  return <iframe src={url} width="100%" height="100%" style={{ borderWidth: '0' }} />;
}

function onSelectorReady(selector: HTMLDivElement) {
  const input = _$(PrunCss.PanelSelector.input, selector) as HTMLInputElement;
  const form = input.form!;
  form.addEventListener('submit', ev => {
    const parts = input.value.split(' ');
    const isXitWeb = parts[0].toUpperCase() === 'XIT' && parts[1].toUpperCase() === 'WEB';
    if (!isXitWeb || !isValidUrl(parts[2]) || parts[3]) {
      return;
    }

    ev.stopPropagation();
    parts[2] = prunBtoa(parts[2]);
    changeValue(input, parts.join(' '));
    setTimeout(() => form.requestSubmit(), 0);
  });
}

function isValidUrl(url: string) {
  try {
    return Boolean(new URL(url));
  } catch {
    return false;
  }
}

function prunBtoa(input: string) {
  const base64 = btoa(input);
  return base64.replace('+', '--').replace('/', '-').replace('=', '');
}

function prunAtob(input: string) {
  let base64 = input.replace('--', '+').replace('-', '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}
xit.add({
  command: 'WEB',
  name: 'WEB PAGE',
  component: () => WEB,
});

function init() {
  observeReadyElementsByClassName(PrunCss.Tile.selector, onSelectorReady);
}

features.add({
  id: 'xit-web',
  init,
});

xit.add({
  command: 'PRUN',
  name: 'PRUN-CEPTION',
  component: () => <WEB parameters={['', 'https://apex.prosperousuniverse.com/#/']} />,
});

xit.add({
  command: 'PROSPERITY',
  name: 'PROSPERITY',
  component: parameters => {
    let url = 'https://prosperity-prun.netlify.app/';
    if (parameters.length == 3) {
      url += `?from=${parameters[1]}&to=${parameters[2]}`;
    }
    return <WEB parameters={['', url]} />;
  },
});

xit.add({
  command: ['SHEET', 'SHEETS'],
  name: 'GOOGLE SHEETS',
  component: parameters => {
    if (parameters.length < 2) {
      return <div>Error! Not Enough Parameters!</div>;
    }
    let url = parameters[1];
    for (let i = 2; i < parameters.length; i++) {
      url += `_${parameters[i]}`;
    }
    return (
      <WEB parameters={['', `https://docs.google.com/spreadsheets/d/${url}/edit?usp=sharing`]} />
    );
  },
});

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
xit.add({
  command: 'WIKI',
  name: 'PRUN WIKI',
  component: parameters => {
    const url =
      parameters[1] && parameters[1].toLowerCase() == 'resources'
        ? 'https://handbook.apex.prosperousuniverse.com/wiki/community-resources/index.html'
        : 'https://handbook.apex.prosperousuniverse.com/wiki/index.html';
    return <WEB parameters={['', url]} />;
  },
});

xit.add({
  command: ['PLANNER', 'PLAN', 'PRUNPLANNER'],
  name: 'PRUN PLANNER',
  component: parameters => {
    let url = 'https://prunplanner.org';
    for (let i = 1; i < parameters.length; i++) {
      url += `/${parameters[i]}`;
    }
    return <WEB parameters={['', url]} />;
  },
});

xit.add({
  command: 'MAP',
  name: "Taiyi's Map",
  component: () => <WEB parameters={['', 'https://universemap.duckdns.org/']} />,
});
