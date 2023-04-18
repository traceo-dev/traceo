import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  providers: [AlertService],
  controllers: [AlertController],
  exports: [AlertService]
})
export class AlertModule { }
