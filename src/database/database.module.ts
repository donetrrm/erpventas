import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../config';

@Global()
@Module({
    imports: [
      TypeOrmModule.forRootAsync({
        inject: [config.KEY],
        useFactory: (configService: ConfigType<typeof config>) => {
          return {
            type: 'mysql',
            url: configService.MYSQL_URL,
            ssl: {
              rejectUnauthorized: false
            },
            synchronize: false,
            autoLoadEntities: true,
            entities: []
          };
        },
      }),
    ],
    exports: [TypeOrmModule],
  })
export class DatabaseModule {}
