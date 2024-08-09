import useReactive from '@src/hooks/use-reactive';
import { Fragment, h } from 'preact';
import { PlanetBurn } from '@src/XIT/BURN/BURN';
import PlanetHeader from '@src/XIT/BURN/PlanetHeader';
import MaterialRow from '@src/XIT/BURN/MaterialRow';
import usePrunSelector from '@src/hooks/use-prun-selector';
import { selectMaterialsByTickers, sortMaterials } from '@src/prun-api/data/materials';

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
    rows.push(<PlanetHeader burn={burn} minimized={isMinimized} onClick={onHeaderClick} />);
  }

  if (!isMinimized) {
    rows.push(<MaterialList isMultiplanet={isMultiplanet} burn={burn} dispSettings={dispSettings} />);
  }

  return <tbody>{rows}</tbody>;
}

function MaterialList(props: { isMultiplanet: boolean; burn: PlanetBurn; dispSettings }) {
  const { isMultiplanet, burn, dispSettings } = props;

  const materials = usePrunSelector(selectMaterialsByTickers, Object.keys(burn.burn))
    .filter(x => x)
    .map(x => x!);
  const sortedMaterials = usePrunSelector(sortMaterials, materials);

  return (
    <>
      {sortedMaterials.map(x => (
        <MaterialRow key={x.id} material={x} isMultiplanet={isMultiplanet} burn={burn} dispSettings={dispSettings} />
      ))}
    </>
  );
}
