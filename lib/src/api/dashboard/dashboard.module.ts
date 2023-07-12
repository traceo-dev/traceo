import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ProjectQueryService } from '../project/project-query/project-query.service';
import { DashboardQueryService } from './dashboard-query/dashboard-query.service';
import { MemberQueryService } from '../member/member-query/member-query.service';

@Module({
  imports: [],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    DashboardQueryService,
    ProjectQueryService,
    MemberQueryService
  ],
  exports: [
    DashboardService,
    DashboardQueryService
  ]
})
export class DashboardModule { }
