// Game limits shared by CX actions and steps.
// CXPO does not keep more significant figures than this in a limit price.
export const maxCxPriceSignificantFigures = 3;

export function isValidCxPrice(price: number) {
  return Number(price.toPrecision(maxCxPriceSignificantFigures)) === price;
}
