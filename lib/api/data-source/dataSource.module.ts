import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GuardsService } from '../../common/guards/guards.service';
import { InfluxModule } from '../../providers/influx/influx.module';
import { InfluxService } from '../../providers/influx/influx.service';
import { DataSourceController } from './dataSource.controller';
import { DataSourceService } from './dataSource.service';

@Module({
    imports: [
        InfluxModule,
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    providers: [
        DataSourceService, 
        InfluxService, 
        GuardsService
    ],
    controllers: [DataSourceController],
    exports: [DataSourceService]
})
export class DataSourceModule { }
