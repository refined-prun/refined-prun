export interface Config {
  materials?: string;
  // Currency/exchange the pasted prices are denominated in. May be
  // configurableValue ('Configure on Execution') to choose at run time.
  currency?: string;
}
