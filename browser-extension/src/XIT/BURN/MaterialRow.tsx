import useReactive from '@src/hooks/use-reactive';
import { settings } from '@src/store/settings';
import MaterialIcon from '@src/components/MaterialIcon';
import { h } from 'preact';
import { PlanetBurn } from '@src/XIT/BURN/BURN';
import { getMaterialNameByTicker } from '@src/prun-ui/material-names';
import DaysCell from '@src/XIT/BURN/DaysCell';

export default function MaterialRow(props: {
  material: PrunApi.Material;
  isMultiplanet: boolean;
  burn: PlanetBurn;
  dispSettings;
}) {
  const { material, isMultiplanet, burn, dispSettings } = props;
  const { red, yellow, resupply } = useReactive(() => ({
    red: settings.burn.red,
    yellow: settings.burn.yellow,
    resupply: settings.burn.resupply,
  }));

  const matBurn = burn.burn[material.ticker];
  const days = matBurn.DaysLeft;
  const production = matBurn.DailyAmount;
  const invAmount = matBurn.Inventory ?? 0;

  const isRed = days <= red;
  const isYellow = days <= yellow;
  const isGreen = days > yellow;
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

  const needAmt = days > resupply || production > 0 ? 0 : (days - resupply) * production;

  return (
    <tr>
      <td style={materialColumnStyle}>
        <MaterialIcon small ticker={material.ticker} />
      </td>
      <td>
        <span style={{ fontWeight: 'bold' }}>{getMaterialNameByTicker(material.ticker)}</span>
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
      <DaysCell days={days} />
    </tr>
  );
}
