declare namespace PrunApi {
  interface CompanyData {
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

  interface CompanyHQ {
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

  interface HQEfficiencyGain {
    category: string;
    gain: number;
  }

  interface RatingReport {
    overallRating: string;
    contractCount: number;
    earliestContract: EarliestContract;
  }

  interface EarliestContract {
    timestamp: number | null;
  }

  interface CompanyRepresentation {
    currentLevel: number;
    costNextLevel: RepresentationLevel;
    contributedNextLevel: RepresentationLevel;
    leftNextLevel: RepresentationLevel;
    contributedTotal: RepresentationLevel;
    contributors: unknown[];
  }

  interface RepresentationLevel {
    amount: number;
    currency: string;
  }
}
