import { h } from 'preact';
import { PlanetBurn } from '@src/XIT/BURN/BURN';
import DaysCell from '@src/XIT/BURN/DaysCell';

export default function PlanetHeader(props: { burn: PlanetBurn; minimized: boolean; onClick: () => void }) {
  const { burn, minimized, onClick } = props;

  let days = 1000;
  for (const key of Object.keys(burn.burn)) {
    const mat = burn.burn[key];
    if (!isNaN(mat.DailyAmount) && mat.DailyAmount < 0 && mat.DaysLeft < days) {
      days = mat.DaysLeft;
    }
  }

  return (
    <tr style={{ borderBottom: '1px solid #2b485a' }}>
      <td colSpan={5} class="title" style={{ display: 'table-cell', backgroundColor: 'rgba(1, 1, 1, 0)' }}>
        <div class="pb-burn-minimize" onClick={onClick}>
          {minimized ? '+' : '-'}
        </div>
        <span>{burn.planetName}</span>
      </td>
      <DaysCell days={days} />
    </tr>
  );
}
