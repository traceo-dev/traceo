import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { PassportModule } from '@nestjs/passport';
import { AlertQueryService } from './query/alert-query.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  providers: [AlertService, AlertQueryService],
  controllers: [AlertController],
  exports: [AlertService, AlertQueryService]
})
export class AlertModule { }
