import { Injectable, Logger } from "@nestjs/common";
import { ConsoleService } from "nestjs-console";
import { Auth0Service } from "modules/auth0/auth0.service";
import { Auth0User, AggregateRecord } from "interfaces";
import { DateService } from "shared/date.service";
import { CsvService } from "shared/csv.service";

@Injectable()
export class CliService {
  private readonly logger = new Logger(CliService.name);

  constructor(
    private readonly consoleService: ConsoleService,
    private readonly auth0Service: Auth0Service,
    private readonly csvService: CsvService,
    private readonly dateService: DateService,
  ) {
    const cli = this.consoleService.getCli();

    this.consoleService.createCommand(
      {
        command: "aggregate <from> <to>",
        description: "Aggregate auth0 users by date. yarn aggregate 2022-04-10 2022-04-13",
      },
      this.aggregateUser,
      cli,
    );

    this.consoleService.createCommand(
      {
        command: "aggregate:today",
        description: "Outputs the user registered today in auth0.",
      },
      this.aggregateToday,
      cli,
    );
  }

  aggregateUser = async (from: string, to: string): Promise<void> => {
    try {
      this.dateService.isValidDate(new Date(from));
      this.dateService.isValidDate(new Date(to));
      const ranges = this.dateService.getRanges(from, to);

      const token = await this.auth0Service.getOauthToken();
      const users: Auth0User[] = [];
      await this.auth0Service.getUsers(
        token,
        {
          min: from,
          max: to,
        },
        users,
        Auth0Service.INITIAL_PAGE,
      );

      const results = ranges.map((range): AggregateRecord => {
        const tomorrow = this.dateService.getTomorrow(range);

        const filtered = users.filter((user): boolean =>
          this.dateService.between(user.created_at, range, tomorrow),
        );

        return {
          date: range,
          users: filtered,
        };
      });

      await this.csvService.generateCsv(
        this.csvService.getRangeFilename(from, to),
        this.csvService.generateCsvRecord(results),
      );

      results.map((result): void => {
        console.log(`The number of registered auth0 on ${result.date} is ${result.users.length}.`);
      });

      console.log(
        `\nThe total number of auth0 registered from ${from} to ${to} is ${results.length}.`,
      );
    } catch (e) {
      const { message } = <Error>e;

      this.logger.error(`Aggregation failed.${message}`);
    }
  };

  aggregateToday = async (): Promise<void> => {
    try {
      const token = await this.auth0Service.getOauthToken();
      const today = this.dateService.getToday();
      const users: Auth0User[] = [];
      await this.auth0Service.getUsers(
        token,
        {
          min: today,
          max: today,
        },
        users,
        Auth0Service.INITIAL_PAGE,
      );

      console.log(`The number of registered users of auth0 today is ${users.length}.`);
    } catch (e) {
      const { message } = <Error>e;

      this.logger.error(`Today's aggregation failed .${message}.`);
    }
  };
}
