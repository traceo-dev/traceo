import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ILog, LogsQuery } from '@traceo/types';
import { LogsQueryService } from './logs-query/logs-query.service';
import { ApiResponse } from 'src/common/types/dto/response.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/decorators/auth-guard.decorator';

@ApiTags('logs')
@Controller('logs')
// @UseGuards(new AuthGuard())
export class LogsController {
    constructor(
        private readonly logsQueryService: LogsQueryService
    ) { }

    @Get()
    async getProjectLogs(@Query() query: LogsQuery): Promise<ApiResponse<any>> {
        return await this.logsQueryService.getProjectLogs(query);
    }

    @Get('/graph')
    async getLogsGraphPayload(@Query() query: LogsQuery): Promise<ApiResponse<any>> {
        return await this.logsQueryService.getLogsGraphPayload(query);
    }
}
