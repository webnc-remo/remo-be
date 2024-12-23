import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { AuthModule } from './modules/auth/auth.module';
import { MoviesModule } from './modules/movie/movie.module';
import { UserModule } from './modules/user/user.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MoviesModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        throttlers: [configService.throttlerConfigs],
      }),
      inject: [ApiConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      name: 'mongodbConnection',
      useFactory: (configService: ApiConfigService): TypeOrmModuleOptions => ({
        ...configService.mongoConfig,
        type: 'mongodb',
      }),
      inject: [ApiConfigService],
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        const dataSource = new DataSource(options);
        if (!dataSource.isInitialized) {
          return dataSource.initialize();
        }

        return Promise.resolve(dataSource);
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      name: 'postgresConnection',
      useFactory: (configService: ApiConfigService): TypeOrmModuleOptions => ({
        ...configService.postgresConfig,
      }),
      inject: [ApiConfigService],
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        const dataSource = new DataSource(options);
        if (!dataSource.isInitialized) {
          return dataSource
            .initialize()
            .then(() => addTransactionalDataSource(dataSource));
        }

        return Promise.resolve(addTransactionalDataSource(dataSource));
      },
    }),
  ],
  providers: [],
})
export class AppModule {}
