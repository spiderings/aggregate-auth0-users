import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === "development";
  }

  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }

  getString(key: string, defaultValue?: string): string {
    const value = this.configService.get<string>(key, defaultValue ?? "defaultValue");
    if (!value) {
      throw new Error(`"${key}" environment variable is not set`);
    }

    return value.toString().replace(/\\n/g, "\n");
  }

  getNumber(key: string, defaultValue?: number): number {
    const value = this.configService.get<number>(key, defaultValue ?? 0);
    if (value === undefined) {
      throw new Error(key + " env var not set");
    }
    try {
      return Number(value);
    } catch {
      throw new Error(key + " env var is not a number");
    }
  }

  get nodeEnv(): string {
    return this.getString("NODE_ENV", "development");
  }
}
