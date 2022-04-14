import { Injectable, Logger } from "@nestjs/common";
import { writeFileSync } from "fs";
import path from "path";
import { stringify } from "csv-stringify";
import { AggregateRecord, Auth0User, authProvider, AuthProviderType } from "interfaces";

@Injectable()
export class CsvService {
  private readonly logger = new Logger(CsvService.name);

  getRangeFilename(from: string, to: string): string {
    return `[${from}-${to}]auth0-registration.csv`;
  }

  generateCsvRecord(records: AggregateRecord[]) {
    return records.map(({ date, users }) => ({
      date,
      amount: users.length,
      password: this.getProviderAmount(users, authProvider.auth0),
      google: this.getProviderAmount(users, authProvider.google),
      facebook: this.getProviderAmount(users, authProvider.facebook),
      twitter: this.getProviderAmount(users, authProvider.twitter),
      line: this.getProviderAmount(users, authProvider.line),
    }));
  }

  generateCsv<T>(filename: string, records: T[]): Promise<boolean> {
    return new Promise((resolve, reject): void => {
      try {
        stringify(
          records,
          {
            header: true,
          },
          (err, output): void => {
            writeFileSync(path.resolve(process.cwd(), "output", filename), output);

            resolve(true);
          },
        );
      } catch (e) {
        const { message } = <Error>e;
        this.logger.error(`cannot generate csv ${message}`);

        reject(false);
      }
    });
  }

  getProviderAmount(users: Auth0User[], provider: AuthProviderType): number {
    return users.filter((user) => user.identities[0].provider === provider).length;
  }
}
