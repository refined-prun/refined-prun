import classNames from 'classnames';
import PrunCss from '@src/prun-ui/prun-css';
import { h } from 'preact';

export default function SettingsButton(props: { toggled: boolean; text: string; width: number; onClick: () => void }) {
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
    PrunCss.fonts.fontRegular,
    PrunCss.type.typeSmall,
  );
  return (
    <span class={buttonClass} onClick={onClick}>
      <div class={barClass} style={barStyle} />
      <div class={textBoxClass}>{text}</div>
    </span>
  );
}
