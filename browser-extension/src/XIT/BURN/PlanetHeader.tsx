import classNames from 'classnames';
import { settings } from '@src/store/settings';
import { h } from 'preact';
import { PlanetBurn } from '@src/XIT/BURN/BURN';

export default function PlanetHeader(props: { burn: PlanetBurn; minimized: boolean; onClick: () => void }) {
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
