import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { InfluxService } from '../../providers/influx/influx.service';
import { DataSourceService } from '../data-source/dataSource.service';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { MetricsQueryService } from './query/metrics-query.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: "jwt" }),
    ],
    providers: [
        MetricsService,
        MetricsQueryService,
        InfluxService,
        DataSourceService
    ],
    controllers: [MetricsController]
})
export class MetricsModule { }
