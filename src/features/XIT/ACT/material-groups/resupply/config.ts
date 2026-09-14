export type MaterialFilter = 'All' | 'Workforce' | 'Production';

export interface Config {
  planet: string;
  days?: number;
  materialFilter?: MaterialFilter;
}
