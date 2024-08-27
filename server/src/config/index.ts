import dotenv from 'dotenv';

type TConfig = {
  SERVER_PORT: string | number | undefined;
  DATABASE_USERNAME: string | undefined;
  DATABASE_HOST: string | undefined;
  DATABASE_PASSWORD: string | undefined;
  DATABASE_NAME: string | undefined;
  SALT_ROUNDS: number | undefined;
  JWT_SECRET: string | undefined;
  SESSION_SECRET: string | undefined;
  NODE_ENV: string | undefined;
  ID_LENGTH: number | undefined;
};

let env;
switch (process.env.NODE_ENV) {
  case 'production':
    dotenv.config();
    env = 'production';
    break;
  case 'test':
    dotenv.config({ path: './.env.test' });
    env = 'test';
    break;
  default:
    dotenv.config({ path: './.env.dev' });
    env = 'development';
    break;
}

let config: TConfig = {
  SERVER_PORT: process.env.SERVER_PORT,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS as string) || 10,
  JWT_SECRET: process.env.JWT_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
  NODE_ENV: env,
  ID_LENGTH: parseInt(process.env.ID_LENGTH as string),
};

export default config;
