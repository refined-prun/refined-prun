import xit from './xit-registry';
import { h } from 'preact';

function CALC() {
  return <iframe src="https://www.desmos.com/scientific" width="100%" height="100%" style={{ borderWidth: '0' }} />;
}

xit.add({
  command: ['CALC', 'CALCULATOR'],
  name: 'CALCULATOR',
  component: () => <CALC />,
});
