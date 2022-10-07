import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { InfluxController } from './influx.controller';
import { InfluxService } from './influx.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    providers: [InfluxService],
    controllers: [InfluxController]
})
export class InfluxModule {}
