import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GuardsService } from '@common/guards/guards.service';
import { InfluxService } from './influx.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    providers: [InfluxService, GuardsService]
})
export class InfluxModule {}
