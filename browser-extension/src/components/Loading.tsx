import { h } from 'preact';
import PrunCss from '@src/prun-ui/prun-css';

export function Loading() {
  return <div class={PrunCss.Loading.loader} title="Loading…" />;
}
