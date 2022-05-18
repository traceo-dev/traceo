import { Module } from '@nestjs/common';
import { ClusterService } from './cluster.service';
import { ClusterController } from './cluster.controller';
import { AcrModule } from 'src/acr/acr.module';
import { AcrService } from 'src/acr/acr.service';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { ClusterQueryService } from './cluster-query/cluster-query.service';

@Module({
  imports: [
    AcrModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule
  ],
  providers: [ClusterService, ClusterQueryService, AcrService],
  controllers: [ClusterController]
})
export class ClusterModule {}
