import { ParseResult, parseContractJson, parseSheets, parseSupplyCart } from './parsers';

interface ParserConfig {
  id: string;
  label: string;
  placeholder: string;
  example: string;
  parse: (text: string) => ParseResult;
}

export const parserOptions: ParserConfig[] = [
  {
    id: 'json',
    label: 'JSON',
    placeholder:
      'Paste contract JSON, e.g. {"type": "SHIP", "currency": "NCC", "origin": "Montem", ' +
      '"destination": "Moria Station", "payment": 10000, "deadline": 5, ' +
      '"materials": [{"ticker": "RAT", "amount": 100}]} - BUY/SELL take "location" and ' +
      'per-material "price" instead. Every field is optional.',
    example: JSON.stringify(
      {
        type: 'SHIP',
        currency: 'NCC',
        origin: 'Montem',
        destination: 'Moria Station',
        payment: 9000,
        deadline: 5,
        materials: [{ ticker: 'RAT', amount: 100 }],
      },
      null,
      2,
    ),
    parse: parseContractJson,
  },
  {
    id: 'sheets',
    label: 'Sheets/Excel',
    placeholder:
      'Paste rows copied from Sheets/Excel: amount, ticker, price (tab-separated). ' +
      'Contract fields are keyword rows: template, currency, location, origin, ' +
      'destination, payment, deadline, autoprovision - keyword in the first column, ' +
      'value in the second.',
    example:
      'template\tBUY\ncurrency\tNCC\nlocation\tMontem\ndeadline\t5\n100\tRAT\t45000\n50\tDW\t120000',
    parse: parseSheets,
  },
  {
    id: 'prunplanner',
    label: 'Prun Planner',
    placeholder: 'Paste PRUNplanner supply cart JSON',
    example: JSON.stringify(
      { groups: [{ name: 'Cart', materials: { RAT: 100, DW: 50 } }] },
      null,
      2,
    ),
    parse: parseSupplyCart,
  },
];
