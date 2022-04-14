export type OauthToken = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
};

export type OauthTokenBody = {
  grant_type: string;
  client_id: string;
  client_secret: string;
  audience: string;
};

type Identity = {
  provider: string;
  access_token: string;
  expires_in: number;
  user_id: string;
  connection: string;
  isSocial: boolean;
};

export type Auth0User = {
  created_at: string;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  locale: string;
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
  identities: Identity[];
  // user_metadata: {},
  app_metadata: { synced_to_rds: boolean; sync_email_verified: boolean };
  last_ip: string;
  last_login: string;
  logins_count: number;
};
