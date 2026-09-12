export interface MaterialEntry {
  ticker: string;
  amount: number;
  price?: number;
}

export type TemplateType = 'BUY' | 'SELL' | 'SHIP';

// Omitted fields leave the form unchanged. Payment is the total across shipment rows.
export interface ContractDraftSpec {
  type?: TemplateType;
  currency?: string;
  deadline?: number;

  // BUY/SELL only.
  location?: string;

  // SHIP only. autoProvision: true = first store at the origin, false = off,
  // string = match a specific store option by text or value. The boolean
  // forms are the portable ones - store names/ids are account-specific.
  origin?: string;
  destination?: string;
  autoProvision?: string | boolean;
  payment?: number;

  materials: MaterialEntry[];
}

export interface ParseResult {
  error?: string;
  groupCount?: number;
  skipped?: number;
  spec: ContractDraftSpec;
}
