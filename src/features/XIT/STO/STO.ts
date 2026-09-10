import STO from '@src/features/XIT/STO/STO.vue';
import { getSiteFromParameters } from '@src/features/XIT/STO/utils';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';

xit.add({
  command: ['STO', 'STORAGE'],
  name: parameters => {
    if (parameters[0]) {
      const site = getSiteFromParameters(parameters);
      if (site) {
        return `Storage - ${getEntityNameFromAddress(site.address)}`;
      }
    }
    return 'Storage Analysis';
  },
  description:
    'Per-base storage analysis: current fill %, days-until-full at current production rate, and ship visitation frequency derived from your fleet.',
  optionalParameters: 'PLANET',
  component: () => STO,
  bufferSize: [900, 500],
});
