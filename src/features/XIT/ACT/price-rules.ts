import { act } from '@src/features/XIT/ACT/act-registry';
import { PriceRule } from '@src/features/XIT/ACT/shared-types';

// Collects the price limits of the actions that use the material group.
export function getGroupPriceRules(pkg: UserData.ActionPackageData, group: string | undefined) {
  const rules: PriceRule[] = [];
  for (const action of pkg.actions) {
    if (action.group !== group) {
      continue;
    }
    const rule = act.getActionInfo(action.type)?.priceRule?.(action);
    if (rule) {
      rules.push({ ...rule, source: `[${action.name}]` });
    }
  }
  return rules;
}
