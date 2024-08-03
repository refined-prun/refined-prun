import PrunCss from '@src/prun-ui/prun-css';
import classNames from 'classnames';
import { ComponentChildren, h } from 'preact';

interface Props {
  name?: string;
  children?: ComponentChildren;
}

export default function GridItemView({ name, children }: Props) {
  let textElement: h.JSX.Element | null = null;

  if (name) {
    const textElementClass = classNames([
      PrunCss.GridItemView.name,
      PrunCss.fonts.fontRegular,
      PrunCss.type.typeRegular,
    ]);
    textElement = <span class={textElementClass}>{name}</span>;
  }

  return (
    <div class={PrunCss.GridItemView.container}>
      <div class={PrunCss.GridItemView.image}>
        {children}
        {textElement}
      </div>
    </div>
  );
}
