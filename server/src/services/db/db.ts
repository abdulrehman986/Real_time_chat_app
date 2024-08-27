import { Sequelize } from 'sequelize';
import config from '../../config';

const sequelize = new Sequelize(
  config.DATABASE_NAME!,
  config.DATABASE_USERNAME!,
  config.DATABASE_PASSWORD!,
  {
    host: config.DATABASE_HOST!,
    dialect: 'mysql',
    logging: false,
  },
);

async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error(`Unable to connect to the database: ${error}`);
  }
}

async function closeDatabaseConnection() {
  try {
    await sequelize.close();
    console.info('Connection has been closed successfully.');
  } catch (error) {
    console.error(`Unable to close the database connection: ${error}`);
  }
}

export { sequelize, connectDatabase, closeDatabaseConnection };
