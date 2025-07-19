declare namespace PrunApi {
  interface User {
    username: string;
    subscriptionLevel: string;
    highestTier: string;
    pioneer: boolean;
    moderator: boolean;
    team: boolean;
    translator: boolean;
    created: DateTime;
    company: Company;
    activeDaysPerWeek: number;
    gifts: Gifts;
    id: string;
  }

  interface Company {
    id: string;
    name: string;
    code: string;
  }

  interface Gifts {
    received: Gift[];
    sent: Gift[];
  }

  interface Gift {
    id: string;
    user: UserShortInfo;
    time: DateTime;
    days: number;
  }

  interface UserShortInfo {
    id: string;
    username: string;
  }
}
