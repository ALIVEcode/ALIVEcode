import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [
    'dist/src/**/entities/*.entity.js',
    'dist/src/**/entities/**/*.entity.js',
    'dist/src/**/**/entities/*.entity.js',
    'dist/src/**/**/entities/**/.entity.js',
    'node_modules/nestjs-admin/**/*.entity.js',
  ],
  synchronize: process.env.SYNCHRONIZE.toLocaleLowerCase() === 'true' ? true : false,
  migrations: ['dist/migrations/**/*.ts'],
  cli: {
    migrationsDir: 'migrations',
  },
  migrationsRun: false,
};
export default config;
