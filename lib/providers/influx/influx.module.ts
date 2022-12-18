import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GuardsService } from '../../common/guards/guards.service';
import { InfluxController } from '../../api/influx.controller';
import { InfluxService } from './influx.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    providers: [InfluxService, GuardsService],
    controllers: [InfluxController]
})
export class InfluxModule {}
