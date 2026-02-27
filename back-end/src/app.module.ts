import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as joi from "joi";
import { envValidationSchema } from "./common/config/env.validation";
import { AppLogger } from "./common/logger/app.logger";
import { HealthModule } from "./health/health.module";
import { IntegrationsModule } from "./integrations/integrations.module";
import { OrdersModule } from "./orders/orders.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SongsModule } from "./songs/songs.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      validationSchema: joi.object({
        DATABASE_URL: joi.string().required(),
        JWT_SECRET: joi.string().optional(),
        GOOGLE_CLIENT_ID: joi.string().required(),
        GOOGLE_CLIENT_SECRET: joi.string().required(),
        GOOGLE_CALLBACK_URL: joi.string().optional(),
        NODE_ENV: joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: joi.number().default(3000),
      }),

    }),
    HttpModule,
    PrismaModule,
    IntegrationsModule,
    UsersModule,
    SongsModule,
    OrdersModule,
    HealthModule,
    AuthModule
  ],
  providers: [AppLogger],
})
export class AppModule { }
