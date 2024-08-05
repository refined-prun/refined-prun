import './MaterialIcon.css';
import PrunCss from '@src/prun-ui/prun-css';
import classNames from 'classnames';
import { h } from 'preact';
import ColoredIcon from '@src/components/ColoredIcon';

interface Props {
  ticker: string;
  amount?: number;
  small?: boolean;
}

export default function MaterialIcon({ amount, small, ticker }: Props) {
  const classes = classNames(PrunCss.MaterialIcon.container, {
    'rprun-mat-element-small': small,
    'rprun-mat-element-large': !small,
  });

  let amountElement: h.JSX.Element | null = null;
  if (amount) {
    const amountClass = classNames([
      PrunCss.MaterialIcon.indicator,
      PrunCss.MaterialIcon.neutral,
      PrunCss.MaterialIcon.typeVerySmall,
    ]);

    amountElement = (
      <div class={PrunCss.MaterialIcon.indicatorContainer}>
        <div class={amountClass}>{amount}</div>
      </div>
    );
  }

  return (
    <div class={classes}>
      <ColoredIcon ticker={ticker} />
      {amountElement}
    </div>
  );
}
