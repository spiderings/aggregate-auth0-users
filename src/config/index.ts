import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

export const validationSchema = Joi.object({
  // APPLICATION
  NODE_ENV: Joi.string()
    .valid("development", "production", "test", "provision")
    .default("development"),
  PORT: Joi.number().default(3000).description("application port"),
  // AUTH0
  AUTH0_CLIENT_ID: Joi.string().required().description("auth0 client id"),
  AUTH0_CLIENT_SECRET: Joi.string().required().description("auth0 client secret"),
  AUTH0_AUDIENCE: Joi.string().required().description("auth0 audience"),
  AUTH0_ENDPOINT: Joi.string().required().description("auth0 endpoint"),
});

export const envFilePath = `.env.${process.env.NODE_ENV ?? "development"}`;
