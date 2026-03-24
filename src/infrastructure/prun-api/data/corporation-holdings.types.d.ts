declare namespace PrunApi {
  interface CorporationHolding {
    corporation: {
      id: string;
      name: string;
      code: string;
    };
    shares: number;
    bookValue: CurrencyAmount;
    primary: boolean;
  }
}
