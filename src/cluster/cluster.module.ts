import { Module } from '@nestjs/common';
import { ClusterService } from './cluster.service';
import { ClusterController } from './cluster.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { ClusterQueryService } from './cluster-query/cluster-query.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule
  ],
  providers: [ClusterService, ClusterQueryService],
  controllers: [ClusterController]
})
export class ClusterModule {}
