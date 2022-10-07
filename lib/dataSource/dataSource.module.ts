import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DataSourceController } from './dataSource.controller';
import { DataSourceService } from './dataSource.service';
import { InfluxModule } from './influx/influx.module';

@Module({
    imports: [
        InfluxModule,
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    providers: [
        DataSourceService
    ],
    controllers: [
        DataSourceController
    ]
})
export class DataSourceModule { }
