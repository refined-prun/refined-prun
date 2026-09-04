import {
  ActionPackageConfig,
  configurableValue,
  groupTargetPrefix,
  actionTargetPrefix,
} from '@src/features/XIT/ACT/shared-types';

const MAX_RESOLVE_DEPTH = 10;

export function resolveGroupPlanet(
  planet: string | undefined,
  pkg: UserData.ActionPackageData,
  config: ActionPackageConfig,
  depth = 0,
): string | undefined {
  if (!planet) {
    return undefined;
  }
  if (!planet.startsWith(groupTargetPrefix)) {
    return planet;
  }
  if (depth >= MAX_RESOLVE_DEPTH) {
    return undefined;
  }

  const refName = planet.slice(groupTargetPrefix.length);
  const refGroup = pkg.groups.find(x => x.name === refName);
  if (!refGroup?.planet) {
    return undefined;
  }

  if (refGroup.planet === configurableValue) {
    return (config.materialGroups[refName] as { planet?: string })?.planet;
  }
  return resolveGroupPlanet(refGroup.planet, pkg, config, depth + 1);
}

export function resolveActionDest(
  dest: string | undefined,
  pkg: UserData.ActionPackageData,
  config: ActionPackageConfig,
  depth = 0,
): string | undefined {
  if (!dest) {
    return undefined;
  }
  if (!dest.startsWith(actionTargetPrefix)) {
    return dest;
  }
  if (depth >= MAX_RESOLVE_DEPTH) {
    return undefined;
  }

  const refName = dest.slice(actionTargetPrefix.length);
  const refAction = pkg.actions.find(x => x.name === refName);
  if (!refAction?.dest) {
    return undefined;
  }

  if (refAction.dest === configurableValue) {
    return (config.actions[refName] as { destination?: string })?.destination;
  }
  return resolveActionDest(refAction.dest, pkg, config, depth + 1);
}
