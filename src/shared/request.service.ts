import { Injectable, Logger } from "@nestjs/common";
import { map } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";

@Injectable()
export class RequestService {
  private readonly logger = new Logger(RequestService.name);

  constructor(private readonly httpService: HttpService) {}

  async get<T>(url: string, config: AxiosRequestConfig<any>, errMsg: string): Promise<T> {
    try {
      return (await this.httpService
        .get(url, config)
        .pipe(map((res: AxiosResponse<T>) => res.data))
        .toPromise()) as T;
    } catch (error) {
      const { message } = <AxiosError>error;
      this.logger.error(`message: ${message}`);

      throw new Error(`${errMsg} message: ${message}`);
    }
  }

  async post<T, K>(
    url: string,
    data: K,
    config: AxiosRequestConfig<any>,
    errMsg: string,
  ): Promise<T> {
    try {
      return (await this.httpService
        .post(url, data, config)
        .pipe(map((res: AxiosResponse<T>) => res.data))
        .toPromise()) as T;
    } catch (error) {
      const { message } = <AxiosError>error;
      this.logger.error(`message: ${message}`);

      throw new Error(`${errMsg} message: ${message}`);
    }
  }
}
