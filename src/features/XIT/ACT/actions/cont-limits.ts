// Game price-per-unit limits shared by CONT actions and steps.
// Require a positive price for each material to prevent free trades.
export const minContractPrice = 0.01;
export const maxContractPrice = 100000000;

// The deadline field's range, in days.
export const minContractDays = 1;
export const maxContractDays = 99;

export function isValidContractPrice(price: number | undefined): price is number {
  return (
    price !== undefined &&
    Number.isFinite(price) &&
    price >= minContractPrice &&
    price <= maxContractPrice
  );
}
