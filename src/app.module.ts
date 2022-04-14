import { Module } from "@nestjs/common";
import { ConsoleModule } from "nestjs-console";
import { CliService } from "./cli-service";
import { SharedModule } from "shared/shared.module";
import { ConfigModule } from "@nestjs/config";
import { validationSchema, envFilePath } from "config";
import { Auth0Module } from "modules/auth0/auth0.module";

@Module({
  imports: [
    ConsoleModule,
    Auth0Module,
    SharedModule,
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      validationSchema,
    }),
  ],
  providers: [CliService],
})
export class AppModule {}
