import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { ApiConfigService } from "./api-config.service";
import { CsvService } from "./csv.service";
import { DateService } from "./date.service";
import { RequestService } from "./request.service";

const providers = [ApiConfigService, RequestService, CsvService, DateService];

@Global()
@Module({
  imports: [HttpModule],
  providers,
  exports: [...providers, HttpModule],
})
export class SharedModule {}
