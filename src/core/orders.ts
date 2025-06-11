// MM orders don't have the amount.
export function isFiniteOrder(
  order: PrunApi.CXBrokerOrder,
): order is PrunApi.CXBrokerOrder & { amount: number } {
  return order.amount !== null;
}
