import { AxiosError } from "axios";
import { Auth0User, OauthToken, OauthTokenBody, Ranges } from "interfaces";
import { Injectable, Logger } from "@nestjs/common";
import { ApiConfigService } from "shared/api-config.service";
import { RequestService } from "shared/request.service";
import queryString from "query-string";

@Injectable()
export class Auth0Service {
  static INITIAL_PAGE = 0;
  static MAX_PAGE = 50;
  private readonly logger = new Logger(Auth0Service.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly audience: string;
  private readonly endpoint: string;

  constructor(
    private readonly requestService: RequestService,
    private readonly apiConfigService: ApiConfigService,
  ) {
    this.clientId = this.apiConfigService.getString("AUTH0_CLIENT_ID");
    this.clientSecret = this.apiConfigService.getString("AUTH0_CLIENT_SECRET");
    this.audience = this.apiConfigService.getString("AUTH0_AUDIENCE");
    this.endpoint = this.apiConfigService.getString("AUTH0_ENDPOINT");
  }

  getHeaders(token: string): { authorization: string; "content-type": string } {
    return {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    };
  }

  async getOauthToken(): Promise<string> {
    try {
      const headers = {
        "content-type": "application/json",
      };
      const body = {
        grant_type: "client_credentials",
        client_id: this.clientId,
        client_secret: this.clientSecret,
        audience: this.audience,
      };

      const res = await this.requestService.post<OauthToken, OauthTokenBody>(
        `${this.endpoint}oauth/token`,
        body,
        {
          headers,
        },
        "cannot get oauth token",
      );
      const { access_token } = res;

      return access_token;
    } catch (e) {
      const { message } = <AxiosError>e;
      this.logger.error(`cannot get oauth token ${message}`);

      throw Error(`cannot get access token from auth0. message: ${message}.`);
    }
  }

  async getUsers(token: string, ranges: Ranges, users: Auth0User[], page: number): Promise<void> {
    try {
      const headers = this.getHeaders(token);
      const stringified = queryString.stringify({
        q: `created_at:[${ranges.min} TO ${ranges.max}]`,
        search_engine: "v3",
        page,
        per_page: Auth0Service.MAX_PAGE,
      });

      const res = await this.requestService.get<Auth0User[]>(
        `${this.endpoint}api/v2/users?${stringified}`,
        {
          headers,
        },
        "cannot get users",
      );

      users.push(...res);

      if (res.length === Auth0Service.MAX_PAGE) {
        await this.getUsers(token, ranges, users, page + 1);
      }
    } catch (e) {
      const { message } = <AxiosError>e;
      this.logger.error(`cannot get users ${message}`);

      throw Error(`cannot get users from auth0. message: ${message}.`);
    }
  }
}
