import { BurnValues, calculateBurn, comparePlanets, findCorrespondingPlanet, showBuffer } from '@src/util';
import { Selector } from '@src/Selector';
import prun from '@src/prun-api/prun';
import xit from '../xit-registry';
import { settings } from '@src/store/settings';
import user from '@src/store/user';
import { h } from 'preact';
import { Planet } from '@src/prun-api/prun-planets';
import useReactive from '@src/hooks/use-reactive';
import { useRef } from 'preact/compat';
import BurnSection from '@src/XIT/BURN/BurnSection';
import SettingsButton from '@src/XIT/BURN/SettingsButton';

function BURN(props: { parameters: string[] }) {
  const { parameters } = props;
  const requestedData = useRef(new Set() as Set<string>);
  const planetBurn = useReactive(() =>
    internalCalculateBurn(parameters, id => {
      if (requestedData.current.has(id)) {
        return;
      }
      requestedData.current.add(id);
      showBuffer(`BS ${id}`, true, true);
    }),
  );

  const screenNameElem = document.querySelector(Selector.ScreenName);
  const screenName = screenNameElem ? screenNameElem.textContent : '';

  const bufferName = screenName + parameters.join('');

  const dispSettings = settings.burn.buffers[bufferName] || {
    red: true,
    yellow: true,
    green: true,
    inf: true,
    minimized: {},
  };
  settings.burn.buffers[bufferName] = dispSettings;

  const isMultiplanet = parameters.length > 2 || parameters[1].toLowerCase() == 'all';
  const sections = [] as h.JSX.Element[];

  for (const burn of planetBurn) {
    sections.push(<BurnSection isMultiplanet={isMultiplanet} burn={burn} dispSettings={dispSettings} />);
  }

  function onRedClick() {
    dispSettings.red = !dispSettings.red;
    // setSettings(pmmgSettings);
  }

  function onYellowClick() {
    dispSettings.yellow = !dispSettings.yellow;
    // setSettings(pmmgSettings);
  }

  function onGreenClick() {
    dispSettings.green = !dispSettings.green;
    //setSettings(pmmgSettings);
  }

  function onInfClick() {
    dispSettings.inf = !dispSettings.inf;
    //setSettings(pmmgSettings);
  }

  return (
    <div style={{ height: '100%', flexGrow: 1, paddingTop: '4px' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex' }}>
          <SettingsButton text="RED" width={22.025} toggled={dispSettings.red} onClick={onRedClick} />
          <SettingsButton text="YELLOW" width={40.483} toggled={dispSettings.yellow} onClick={onYellowClick} />
          <SettingsButton text="GREEN" width={34.65} toggled={dispSettings.green} onClick={onGreenClick} />
          <SettingsButton text="INF" width={19.6} toggled={dispSettings.inf} onClick={onInfClick} />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th colSpan={2} style={{ paddingTop: 0 }}>
              Needs
            </th>
            <th style={{ paddingTop: 0 }}>Production</th>
            <th style={{ paddingTop: 0 }}>Inv</th>
            <th style={{ paddingTop: 0 }}>Amt. Needed</th>
            <th style={{ paddingTop: 0 }}>Burn</th>
          </tr>
        </thead>
        {sections}
      </table>
    </div>
  );
}

export interface PlanetBurn {
  burn: BurnValues;
  planetName: string;
}

function internalCalculateBurn(parameters: string[], requestData: (id: string) => void) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const planetBurn = [] as PlanetBurn[];
  const planets = [] as Planet[];

  if (parameters.length > 2 && parameters[1].toLowerCase() != 'all') {
    for (let i = 1; i < parameters.length; i++) {
      const planet = prun.planets.get(parameters[i]);
      if (planet) {
        planets.push(planet);
      }
    }
  } else {
    for (const site of user.sites.filter(x => x.type === 'BASE')) {
      const planet = prun.planets.get(site.PlanetNaturalId);
      if (planet) {
        planets.push(planet);
      }
    }
  }

  for (const planet of planets) {
    const production = findCorrespondingPlanet(planet.name, user.production);
    const workforce = findCorrespondingPlanet(planet.name, user.workforce);
    const inv = findCorrespondingPlanet(planet.name, user.storage, true);
    if (!production || !workforce) {
      requestData(planet.naturalId);
      continue;
    }

    planetBurn.push({ burn: calculateBurn(production, workforce, inv), planetName: planet.name });
  }

  // If more than 1 planet, make "overall" category
  if (planetBurn.length > 1) {
    const overallBurn = {};
    for (const burn of planetBurn) {
      for (const mat of Object.keys(burn.burn)) {
        if (overallBurn[mat]) {
          overallBurn[mat].DailyAmount += burn.burn[mat].DailyAmount;
          overallBurn[mat].Inventory += burn.burn[mat].Inventory;
        } else {
          overallBurn[mat] = {};
          overallBurn[mat].DailyAmount = burn.burn[mat].DailyAmount;
          overallBurn[mat].Inventory = burn.burn[mat].Inventory;
        }
      }
    }

    for (const mat of Object.keys(overallBurn)) {
      if (overallBurn[mat].DailyAmount >= 0) {
        overallBurn[mat].DaysLeft = 1000;
      } else {
        overallBurn[mat].DaysLeft = -overallBurn[mat].Inventory / overallBurn[mat].DailyAmount;
      }
    }

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

xit.add({
  command: 'BURN',
  name: parameters => {
    if (parameters[1] && !parameters[2]) {
      return `ENHANCED BURN - ${parameters[1].toUpperCase()}`;
    }

    return 'ENHANCED BURN';
  },
  component: parameters => <BURN parameters={parameters} />,
});
