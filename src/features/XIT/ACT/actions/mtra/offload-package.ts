import { configurableValue } from '@src/features/XIT/ACT/shared-types';

export function buildOffloadPackage(
  groupName: string | undefined,
  materials: Record<string, number>,
  origin: string | undefined,
  destination = configurableValue,
): UserData.ActionPackageData {
  return {
    global: { name: 'Auto Offload' },
    groups: [{ type: 'Manual', name: groupName, materials }],
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
