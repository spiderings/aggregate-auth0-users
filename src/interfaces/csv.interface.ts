import { Auth0User } from "./auth0.interface";

export type AggregateRecord = {
  date: string;
  users: Auth0User[];
};

export const authProvider = {
  google: "google-oauth2",
  auth0: "auth0",
  twitter: "twitter",
  facebook: "facebook",
  line: "line",
} as const;

export type AuthProviderType = typeof authProvider[keyof typeof authProvider];
