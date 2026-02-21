import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envValidationSchema } from "./common/config/env.validation";
import { AppLogger } from "./common/logger/app.logger";
import { HealthModule } from "./health/health.module";
import { IntegrationsModule } from "./integrations/integrations.module";
import { OrdersModule } from "./orders/orders.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SongsModule } from "./songs/songs.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      validationSchema: envValidationSchema,
    }),
    HttpModule,
    PrismaModule,
    IntegrationsModule,
    UsersModule,
    SongsModule,
    OrdersModule,
    HealthModule,
  ],
  providers: [AppLogger],
})
export class AppModule {}
