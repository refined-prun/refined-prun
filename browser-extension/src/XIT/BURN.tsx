import { BurnValues, calculateBurn, CategorySort, comparePlanets, findCorrespondingPlanet, showBuffer } from '../util';
import { Selector } from '../Selector';
import prun from '@src/prun-api/prun';
import xit from './xit-registry';
import { settings } from '@src/store/settings';
import user from '@src/store/user';
import { h } from 'preact';
import classNames from 'classnames';
import PrunCss from '@src/prun-ui/prun-css';
import { Planet } from '@src/prun-api/prun-planets';
import useReactive from '@src/hooks/use-reactive';
import { CategoryColors } from '@src/Style';
import { useRef } from 'preact/compat';

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

function BurnSection(props: { isMultiplanet: boolean; burn: PlanetBurn; dispSettings }) {
  const { isMultiplanet, burn, dispSettings } = props;

  const isMinimized = useReactive(() => dispSettings.minimized && dispSettings.minimized[burn.planetName]);

  const rows = [] as h.JSX.Element[];

  const onHeaderClick = () => {
    if (dispSettings.minimized[burn.planetName]) {
      delete dispSettings.minimized[burn.planetName];
    } else {
      dispSettings.minimized[burn.planetName] = true;
    }

    //setSettings(pmmgSettings);
  };

  if (isMultiplanet) {
    rows.push(<PlanetHeader key={burn.planetName} burn={burn} minimized={isMinimized} onClick={onHeaderClick} />);
  }

  if (!isMinimized) {
    const burnMaterials = Object.keys(burn.burn);
    burnMaterials.sort(CategorySort);

    for (const ticker of burnMaterials) {
      rows.push(
        <MaterialRow
          key={ticker}
          ticker={ticker}
          isMultiplanet={isMultiplanet}
          burn={burn}
          dispSettings={dispSettings}
        />,
      );
    }
  }

  return <tbody>{rows}</tbody>;
}

function PlanetHeader(props: { burn: PlanetBurn; minimized: boolean; onClick: () => void }) {
  const { burn, minimized, onClick } = props;

  let daysLeft = 1000;
  for (const key of Object.keys(burn.burn)) {
    const mat = burn.burn[key];
    if (!isNaN(mat.DailyAmount) && mat.DailyAmount < 0 && mat.DaysLeft < daysLeft) {
      daysLeft = mat.DaysLeft;
    }
  }

  const burnClass = classNames({
    'burn-red-no-hover': daysLeft <= settings.burn.red,
    'burn-yellow-no-hover': daysLeft <= settings.burn.yellow,
    'burn-green-no-hover': daysLeft > settings.burn.yellow,
    'burn-infinite': daysLeft >= 500,
  });

  return (
    <tr style={{ borderBottom: '1px solid #2b485a' }}>
      <td colSpan={5} class="title" style={{ display: 'table-cell', backgroundColor: 'rgba(1, 1, 1, 0)' }}>
        <div class="pb-burn-minimize" onClick={onClick}>
          {minimized ? '+' : '-'}
        </div>
        <span>{burn.planetName}</span>
      </td>
      <td class={burnClass}>
        <span>{daysLeft < 500 ? Math.floor(daysLeft) : '∞'} Days</span>
      </td>
    </tr>
  );
}

function MaterialRow(props: { ticker: string; isMultiplanet: boolean; burn: PlanetBurn; dispSettings }) {
  const { ticker, isMultiplanet, burn, dispSettings } = props;
  const { red, yellow, resupply } = useReactive(() => ({
    red: settings.burn.red,
    yellow: settings.burn.yellow,
    resupply: settings.burn.resupply,
  }));

  const matBurn = burn.burn[ticker];
  const burnDays = matBurn.DaysLeft;
  const production = matBurn.DailyAmount;
  const invAmount = matBurn.Inventory ?? 0;

  const isRed = burnDays <= red;
  const isYellow = burnDays <= yellow;
  const isGreen = burnDays > yellow;
  const isInf = production >= 0;

  const isVisible = useReactive(() => {
    if (isInf && !dispSettings.inf) {
      return false;
    }
    return (isRed && dispSettings.red) || (isYellow && dispSettings.yellow) || (isGreen && dispSettings.green);
  });

  if (!isVisible) {
    return null;
  }

  const materialColumnStyle = {
    width: '32px',
    paddingRight: '0px',
    paddingLeft: isMultiplanet ? '32px' : '0px',
  };

  const consText = Math.abs(production) < 1 ? production.toFixed(2) : production.toFixed(1);

  const needAmt = burnDays > resupply || production > 0 ? 0 : (burnDays - resupply) * production;

  const burnText =
    Number.isFinite(burnDays) && burnDays < 500 && production < 0 ? Math.floor(burnDays).toString() : '∞';

  const burnClass = classNames({
    'burn-red-no-hover': burnDays <= red,
    'burn-yellow-no-hover': burnDays <= yellow,
    'burn-green-no-hover': burnDays > yellow,
    'burn-infinite': production >= 0,
  });

  return (
    <tr>
      <td style={materialColumnStyle}>
        <MaterialIcon small ticker={ticker} />
      </td>
      <td>
        <span style={{ fontWeight: 'bold' }}>{prun.materials.get(ticker)?.displayName}</span>
      </td>
      <td>
        <span>{consText} / Day</span>
      </td>
      <td>
        <span>{invAmount}</span>
      </td>
      <td>
        <span>{isNaN(needAmt) ? '0' : needAmt.toFixed(0)}</span>
      </td>
      <td class={burnClass}>
        <span>{burnText} Days</span>
      </td>
    </tr>
  );
}

interface MaterialProps {
  ticker: string;
  amount?: number;
  text?: boolean;
  small?: boolean;
  building?: boolean;
}

function MaterialIcon({ amount, building, small, text, ticker }: MaterialProps) {
  const material = prun.materials.get(ticker);
  if (!material && ticker != 'SHPT' && !building) {
    // Return nothing if the material isn't recognized
    return null;
  }

  // The full name of the material (Basic Bulkhead)
  const name = material?.displayName || 'Shipment';
  // The category of the material
  const category = material?.category.name || 'shipment';

  const innerContainerStyle = {
    background: building
      ? 'linear-gradient(135deg, rgb(52, 140, 160), rgb(77, 165, 185))'
      : CategoryColors[category][0],
    color: building ? 'rgb(179, 255, 255)' : CategoryColors[category][1],
  };
  const innerContainerTitle = building ? '' : name;
  const onInnerContainerClick = () => {
    showBuffer(`MAT ${ticker.toUpperCase()}`);
  };

  const innerContainer = (
    <div
      class={PrunCss.ColoredIcon.container}
      style={innerContainerStyle}
      title={innerContainerTitle}
      onClick={onInnerContainerClick}>
      <div class={PrunCss.ColoredIcon.labelContainer}>
        <span class={PrunCss.ColoredIcon.label}>{ticker}</span>
      </div>
    </div>
  );

  const materialIconClasses = classNames(PrunCss.MaterialIcon.container, {
    'mat-element-small': small,
    'mat-element-large': !small,
  });

  let amountElement: h.JSX.Element | null = null;
  if (amount) {
    const amountClass = classNames([
      PrunCss.MaterialIcon.indicator,
      PrunCss.MaterialIcon.neutral,
      'MaterialIcon__type-very-small___UMzQ3ir',
    ]);

    amountElement = (
      <div class={PrunCss.MaterialIcon.indicatorContainer}>
        <div class={amountClass}>{amount}</div>
      </div>
    );
  }

  const materialIcon = (
    <div class={materialIconClasses}>
      {innerContainer}
      {amountElement}
    </div>
  );

  if (small) {
    // Small material elements don't need all the wrapping
    return materialIcon;
  }

  let textElement: h.JSX.Element | null = null;

  if (text) {
    const textElementClass = classNames([
      PrunCss.GridItemView.name,
      'fonts__font-regular___Sxp1xjo',
      'type__type-regular___k8nHUfI',
    ]);
    textElement = <span class={textElementClass}>{name}</span>;
  }

  return (
    <div class={PrunCss.GridItemView.container}>
      <div class={PrunCss.GridItemView.image}>
        {materialIcon}
        {textElement}
      </div>
    </div>
  );
}

function SettingsButton(props: { toggled: boolean; text: string; width: number; onClick: () => void }) {
  const { toggled, text, width, onClick } = props;
  const buttonClass = classNames(PrunCss.RadioItem.container, PrunCss.RadioItem.containerHorizontal);
  const barUntoggledClass = classNames(PrunCss.RadioItem.indicator, PrunCss.RadioItem.indicatorHorizontal);
  const barToggledClass = classNames(
    PrunCss.RadioItem.indicator,
    PrunCss.RadioItem.indicatorHorizontal,
    PrunCss.RadioItem.active,
    PrunCss.effects.shadowPrimary,
  );
  const barClass = toggled ? barToggledClass : barUntoggledClass;
  const barStyle = {
    width: `${width}px`,
    maxWidth: `${width}px`,
    height: '2px',
  };
  const textBoxClass = classNames(
    PrunCss.RadioItem.value,
    PrunCss.RadioItem.valueHorizontal,
    // TODO: These classes were not exported for some reason
    'fonts__font-regular___Sxp1xjo',
    'type__type-small___pMQhMQO',
  );
  return (
    <span class={buttonClass} onClick={onClick}>
      <div class={barClass} style={barStyle} />
      <div class={textBoxClass}>{text}</div>
    </span>
  );
}

interface PlanetBurn {
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
