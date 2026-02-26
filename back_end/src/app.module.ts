import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    PrismaModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
