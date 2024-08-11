import { comparePlanets } from '@src/util';
import xit from '../xit-registry';
import { settings } from '@src/store/settings';
import { h } from 'preact';
import { useMemo } from 'preact/compat';
import BurnSection from '@src/XIT/BURN/BurnSection';
import SettingsButton from '@src/XIT/BURN/SettingsButton';
import { _$ } from '@src/utils/get-element-by-class-name';
import PrunCss from '@src/prun-ui/prun-css';
import features from '@src/feature-registry';
import { State } from '@src/prun-api/data/store';
import { selectSiteByPlanetNaturalIdOrName, selectSitesEntities } from '@src/prun-api/data/sites';
import usePrunSelector from '@src/hooks/use-prun-selector';
import { createBurnSelector, PlanetBurn } from '@src/burn';
import { createSelector } from '@reduxjs/toolkit';

function BURN(props: { parameters: string[] }) {
  const { parameters } = props;

  const sitesSelector = useMemo(() => createSitesSelector(parameters), [parameters]);
  const sites = usePrunSelector(sitesSelector);

  const burnsSelector = useMemo(() => createBurnSelectorForSites(sites), [sites]);
  const planetBurn = usePrunSelector(burnsSelector);

  const screenNameElem = _$(PrunCss.ScreenControls.currentScreenName);
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
    sections.push(
      <BurnSection key={burn.planetName} isMultiplanet={isMultiplanet} burn={burn} dispSettings={dispSettings} />,
    );
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
            <th style={{ paddingTop: 0 }}>Days</th>
          </tr>
        </thead>
        {sections}
      </table>
    </div>
  );
}

function createSitesSelector(parameters: string[]) {
  if (parameters.length === 1 || parameters[1].toLowerCase() == 'all') {
    return createSelector(selectSitesEntities, sites => Object.values(sites) as PrunApi.Site[]);
  }

  const selectors = parameters.slice(1).map(x => (state: State) => selectSiteByPlanetNaturalIdOrName(state, x));
  return createSelector(selectors, (...sites) => sites.filter((x): x is PrunApi.Site => x !== undefined));
}

function createBurnSelectorForSites(sites: PrunApi.Site[]) {
  return createSelector(sites.map(createBurnSelector), processBurn);
}

function processBurn(...burn: (PlanetBurn | undefined)[]) {
  const filtered = burn.filter((x): x is PlanetBurn => x !== undefined);
  filtered.sort((a, b) => comparePlanets(a.planetName, b.planetName));

  if (filtered.length <= 1) {
    return filtered;
  }

  const overallBurn = {};
  for (const burn of filtered) {
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

  filtered.push({ burn: overallBurn, planetName: 'Overall' });

  return filtered;
}

function init() {
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
}

features.add({
  id: 'xit-burn',
  init,
});
