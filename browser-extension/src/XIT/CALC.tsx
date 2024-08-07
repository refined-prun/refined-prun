import xit from './xit-registry';
import { h } from 'preact';
import features from '@src/feature-registry';

function CALC() {
  return <iframe src="https://www.desmos.com/scientific" width="100%" height="100%" style={{ borderWidth: '0' }} />;
}

function init() {
  xit.add({
    command: ['CALC', 'CALCULATOR'],
    name: 'CALCULATOR',
    component: () => <CALC />,
  });
}

features.add({
  id: 'xit-calc',
  init,
});
