import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { InfluxService } from './influx.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    providers: [InfluxService]
})
export class InfluxModule { }
