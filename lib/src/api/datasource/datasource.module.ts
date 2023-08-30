import { Module } from '@nestjs/common';
import { DatasourceService } from './datasource.service';
import { DatasourceController } from './datasource.controller';

@Module({
  providers: [DatasourceService],
  controllers: [DatasourceController]
})
export class DatasourceModule {}
