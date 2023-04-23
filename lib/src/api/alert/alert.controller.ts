import { Body, Controller, Post, Get, UseGuards, Query, Param, Delete, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/decorators/auth-guard.decorator';
import { AlertService } from './alert.service';
import { AlertHistoryQueryDto, AlertQueryDto, AlertDto } from 'src/common/types/dto/alert.dto';
import { ApiResponse } from 'src/common/types/dto/response.dto';
import { AlertQueryService } from './alert-query/alert-query.service';
import { IAlert } from '@traceo/types';
import { AlertHistoryQueryService } from './alert-history/alert-history-query.service';

@Controller('alert')
@ApiTags('alert')
@UseGuards(new AuthGuard())
export class AlertController {
    constructor(
        private readonly alertService: AlertService,
        private readonly alertQueryService: AlertQueryService,
        private readonly alertHistoryQueryService: AlertHistoryQueryService
    ) { }

    @Get('/history')
    public async getAlertHistory(
        @Query() query: AlertHistoryQueryDto
    ): Promise<ApiResponse<IAlert[]>> {
        return this.alertHistoryQueryService.getPaginateApiListDto(query);
    }

    @Get('/:id')
    public async getAlert(
        @Param("id") id: string
    ): Promise<ApiResponse<IAlert[]>> {
        return this.alertQueryService.getApiDto(id);
    }

    @Get()
    public async getAlertsForProject(
        @Query() query: AlertQueryDto
    ): Promise<ApiResponse<IAlert[]>> {
        return this.alertQueryService.getPaginateApiListDto(query);
    }

    @Post()
    public async createAlert(
        @Body() dto: AlertDto
    ): Promise<ApiResponse<unknown>> {
        return await this.alertService.createAlert(dto);
    }

    @Patch("/:id")
    public async update(@Param("id") id: string, @Body() update: AlertDto): Promise<ApiResponse<unknown>> {
        return await this.alertService.update(id, update);
    }

    @Delete("/:id")
    public async deleteAlert(@Param("id") id: string): Promise<ApiResponse<unknown>> {
        return await this.alertService.delete(id);
    }
}
