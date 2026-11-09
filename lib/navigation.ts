export const navigationDefaults=["start","ranks","features","join","partners","team","leaderboards","discord","shop","account"] as const;
export type NavigationId=typeof navigationDefaults[number];
