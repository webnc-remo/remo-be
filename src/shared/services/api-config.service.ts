/* eslint-disable import/no-unresolved */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type ThrottlerOptions } from '@nestjs/throttler';
import { type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import { default as parse, type Units } from 'parse-duration';

import { SnakeNamingStrategy } from '../../snake-naming.strategy';

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isStaging(): boolean {
    return this.nodeEnv === 'staging';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getDuration(key: string, format?: Units): number {
    const value = this.getString(key);
    const duration = parse(value, format);

    if (!duration) {
      throw new Error(`${key} environment variable is not a valid duration`);
    }

    return duration;
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replaceAll(String.raw`\n`, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANGUAGE');
  }

  get throttlerConfigs(): ThrottlerOptions {
    return {
      ttl: this.getDuration('THROTTLER_TTL', 'second'),
      limit: this.getNumber('THROTTLER_LIMIT'),
      // storage: new ThrottlerStorageRedisService(new Redis(this.redis)),
    };
  }

  get postgresConfig(): TypeOrmModuleOptions {
    const entities = [
      __dirname + '/../../modules/**/**/entities/*.entity{.ts,.js}',
    ];
    const migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];

    return {
      entities,
      migrations,
      keepConnectionAlive: !this.isTest,
      dropSchema: this.isTest,
      type: 'postgres',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      migrationsRun: true,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      namingStrategy: new SnakeNamingStrategy(),
      name: 'postgresConnection',
    };
  }

  get mongoConfig() {
    const username = this.configService.get<string>('MONGO_USERNAME');
    const password = this.configService.get<string>('MONGO_PASSWORD') ?? '';
    const host = this.configService.get<string>('MONGO_HOST');
    const database = this.configService.get<string>('MONGO_DATABASE');
    const options = this.configService.get<string>('MONGO_OPTIONS', '');
    const entities = [
      __dirname + '/../../modules/**/**/schemas/*.schema{.ts,.js}',
    ];

    return {
      name: 'mongodbConnection',
      entities,
      keepConnectionAlive: !this.isTest,
      dropSchema: this.isTest,
      type: 'mongodb',
      host,
      username,
      password,
      database,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      url: `mongodb+srv://${username}:${encodeURIComponent(password ?? '')}@${host}/${database}${options ? `?${options}` : ''}`,
    };
  }

  get awsS3Config() {
    return {
      bucketRegion: this.getString('AWS_S3_BUCKET_REGION'),
      bucketApiVersion: this.getString('AWS_S3_API_VERSION'),
      bucketName: this.getString('AWS_S3_BUCKET_NAME'),
      accessKeyId: this.getString('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKeyId: this.getString('AWS_S3_SECRET_ACCESS_KEY'),
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get natsEnabled(): boolean {
    return this.getBoolean('NATS_ENABLED');
  }

  get natsConfig() {
    return {
      host: this.getString('NATS_HOST'),
      port: this.getNumber('NATS_PORT'),
    };
  }

  get redisCacheEnabled(): boolean {
    return this.getBoolean('REDIS_CACHE_ENABLED');
  }

  get authConfig() {
    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  get geminiConfig() {
    return {
      apiKey: this.getString('GEMINI_API_KEY'),
      retrieverUrl: this.getString('GEMINI_RETRIEVER_URL'),
      movieCollection: 'movies',
      navigateUrl: this.getString('GEMINI_NAVIGATE_URL'),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }
}
