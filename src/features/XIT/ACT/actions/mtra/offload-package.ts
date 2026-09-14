import { configurableValue } from '@src/features/XIT/ACT/shared-types';
import { billQuantities, MaterialBill } from '@src/features/XIT/ACT/material-bill';

export function buildOffloadPackage(
  groupName: string | undefined,
  materials: MaterialBill,
  origin: string | undefined,
  destination = configurableValue,
): UserData.ActionPackageData {
  return {
    global: { name: 'Auto Offload' },
    groups: [{ type: 'Manual', name: groupName, materials: billQuantities(materials) }],
    actions: [
      {
        type: 'MTRA',
        name: groupName,
        group: groupName,
        origin,
        dest: destination,
      },
    ],
  };
}
