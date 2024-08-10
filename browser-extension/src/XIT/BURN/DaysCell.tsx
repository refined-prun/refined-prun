import classNames from 'classnames';
import { settings } from '@src/store/settings';
import { h } from 'preact';
import PrunCss from '@src/prun-ui/prun-css';
import useReactive from '@src/hooks/use-reactive';

export default function DaysCell(props: { days: number }) {
  const days = Math.floor(props.days);
  const { red, yellow } = useReactive(() => ({
    red: settings.burn.red,
    yellow: settings.burn.yellow,
  }));
  const burnClass = classNames({
    [PrunCss.Workforces.daysMissing]: days <= red,
    [PrunCss.Workforces.daysWarning]: days <= yellow,
    [PrunCss.Workforces.daysSupplied]: days > yellow,
  });

  return (
    <td style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} class={burnClass} />
      <span>{days < 500 ? days : '∞'}</span>
    </td>
  );
}
