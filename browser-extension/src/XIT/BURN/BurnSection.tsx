import useReactive from '@src/hooks/use-reactive';
import { h } from 'preact';
import { CategorySort } from '@src/util';
import { PlanetBurn } from '@src/XIT/BURN/BURN';
import PlanetHeader from '@src/XIT/BURN/PlanetHeader';
import MaterialRow from '@src/XIT/BURN/MaterialRow';

export default function BurnSection(props: { isMultiplanet: boolean; burn: PlanetBurn; dispSettings }) {
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
