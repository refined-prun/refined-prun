import { h } from 'preact';
import { getXitArgs } from '@src/features/xit-commands';
import { useLayoutEffect, useRef } from 'preact/compat';

export interface XITModule {
  create_buffer();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createXitAdapter(xitClass: new (...args: any[]) => XITModule) {
  // eslint-disable-next-line react/display-name
  return (parameters: string[]) => <LegacyXitAdapter xitClass={xitClass} parameters={parameters} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LegacyXitAdapter(props: { xitClass: new (...args: any[]) => XITModule; parameters: string[] }) {
  const container = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const args = getXitArgs();
    const xitObject = new props.xitClass(
      container.current,
      props.parameters,
      args.pmmgSettings,
      args.webData,
      args.modules,
    );
    xitObject.create_buffer();
  }, [props.parameters, props.xitClass]);
  return <div ref={container} style={{ height: '100%', flexGrow: 1, paddingTop: '4px' }} />;
}
