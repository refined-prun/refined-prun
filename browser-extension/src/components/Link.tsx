import './Link.css';
import { showBuffer } from '@src/util';
import { ComponentChildren, h } from 'preact';
import { HTMLAttributes } from 'preact/compat';
import classNames from 'classnames';

interface Props extends HTMLAttributes<HTMLAnchorElement & HTMLDivElement> {
  children?: ComponentChildren;
  inline?: boolean;
  command?: string;
  autoSubmit?: true;
}

export function Link(props: Props) {
  const { children, href, command, autoSubmit, inline, ...rest } = props;
  const classes = classNames(
    {
      'rprun-Link': true,
      'rprun-Link--inline': inline,
    },
    rest['class'],
    rest['className'],
  );
  delete rest['class'];
  delete rest['className'];
  if (href) {
    return (
      <a target="_blank" rel="noreferrer" class={classes} {...(rest as HTMLAttributes<HTMLAnchorElement>)}>
        {children ?? href}
      </a>
    );
  }
  if (command) {
    return (
      <div
        class={classes}
        onClick={() => showBuffer(command, autoSubmit)}
        {...(rest as HTMLAttributes<HTMLDivElement>)}>
        {children ?? command}
      </div>
    );
  }

  throw Error('Link needs a href or command');
}
