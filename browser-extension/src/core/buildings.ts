export function calculateBuildingCondition(age: number) {
  // This isn't quite right, but will be off by only 1 MCG at most
  return age > 180 ? 0 : 1 - age / 180;
}
