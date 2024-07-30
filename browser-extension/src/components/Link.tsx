import { showBuffer } from '@src/util';
import { ComponentChildren, h } from 'preact';
import { HTMLAttributes } from 'preact/compat';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ComponentChildren;
  command: string;
  autoSubmit?: true;
}

export const Link = ({ command, autoSubmit, children }: Props) => (
  <div class="link">
    <span onClick={() => showBuffer(command, autoSubmit)}>{children}</span>
  </div>
);
