import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AccountPermissionService } from '../../../lib/account/account-permission/account-permission.service';
import { InfluxController } from './influx.controller';
import { InfluxService } from './influx.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    providers: [InfluxService, AccountPermissionService],
    controllers: [InfluxController]
})
export class InfluxModule {}
