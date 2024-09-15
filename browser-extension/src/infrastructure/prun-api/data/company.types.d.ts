declare namespace PrunApi {
  export interface CompanyData {
    id: string;
    name: string;
    code: string;
    countryId: string;
    startingProfile: string;
    startingLocation: Address;
    ratingReport: RatingReport;
    headquarters: CompanyHQ;
    representation: CompanyRepresentation;
  }

  export interface CompanyHQ {
    address: Address;
    level: number;
    basePermits: number;
    usedBasePermits: number;
    inventory: ProjectInventory;
    additionalBasePermits: number;
    additionalProductionQueueSlots: number;
    nextRelocationTime: null;
    relocationLocked: boolean;
    efficiencyGains: HQEfficiencyGain[];
    efficiencyGainsNextLevel: HQEfficiencyGain[];
  }

  export interface HQEfficiencyGain {
    category: string;
    gain: number;
  }

  export interface RatingReport {
    overallRating: string;
    contractCount: number;
    earliestContract: EarliestContract;
  }

  export interface EarliestContract {
    timestamp: number | null;
  }

  export interface CompanyRepresentation {
    currentLevel: number;
    costNextLevel: RepresentationLevel;
    contributedNextLevel: RepresentationLevel;
    leftNextLevel: RepresentationLevel;
    contributedTotal: RepresentationLevel;
    contributors: unknown[];
  }

  export interface RepresentationLevel {
    amount: number;
    currency: string;
  }
}
