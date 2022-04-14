import { Injectable } from "@nestjs/common";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

@Injectable()
export class DateService {
  getToday(): string {
    const date = new Date().toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    });

    return dayjs(date).format("YYYY-MM-DD");
  }

  getRanges(from: string, to: string): string[] {
    let currentDate = dayjs(new Date(from));
    const closeTime = dayjs(new Date(to));
    const ranges = [];

    while (currentDate.isBefore(closeTime) || currentDate.isSame(closeTime)) {
      ranges.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }

    return ranges;
  }

  between(date: string, from: string, to: string): boolean {
    return dayjs(new Date(date)).isBetween(dayjs(new Date(from)), dayjs(new Date(to)));
  }

  getTomorrow(date: string): string {
    return dayjs(new Date(date)).add(1, "day").toString();
  }

  isValidDate(date: Date): boolean {
    const result = date instanceof Date && !isNaN(date.valueOf());
    if (!result) {
      throw new Error("invalid date");
    }

    return result;
  }
}
