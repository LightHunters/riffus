import * as Joi from "joi";

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
  PORT: Joi.number().default(4001),
  DATABASE_URL: Joi.string().required(),
  DEEZER_API_URL: Joi.string().uri().default("https://api.deezer.com"),
  ITUNES_API_URL: Joi.string().uri().default("https://itunes.apple.com"),
  FRONTEND_ORIGIN: Joi.string().uri().default("http://localhost:3000"),
  JWT_SECRET: Joi.string().optional(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().optional(),
});
