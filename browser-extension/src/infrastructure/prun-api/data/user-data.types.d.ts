declare namespace PrunApi {
  export interface UserData {
    id: string;
    username: string;
    subscriptionLevel: string;
    subscriptionExpiry: DateTime;
    highestTier: null;
    team: boolean;
    moderator: boolean;
    pioneer: boolean;
    perks: unknown[];
    created: DateTime;
    companyId: string;
    systemNamingRights: number;
    planetNamingRights: number;
    isPayingUser: boolean;
    isModeratorChat: boolean;
    mutedUsers: unknown[];
    blacklistedUsers: unknown[];
    isMuted: boolean;
    discardedNotifications: unknown[];
    contexts: UserContext[];
    preferredLocale: string;
  }

  export interface UserContext {
    id: string;
    type: string;
    creation: DateTime;
    actionRoles: string[];
  }
}
