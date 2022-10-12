import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DataSourceController } from './dataSource.controller';
import { DataSourceService } from './dataSource.service';
import { InfluxModule } from './influx/influx.module';
import { InfluxService } from './influx/influx.service';

@Module({
    imports: [
        InfluxModule,
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    providers: [
        DataSourceService, InfluxService
    ],
    controllers: [
        DataSourceController
    ]
})
export class DataSourceModule { }
