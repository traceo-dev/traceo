import { Body, Controller, Post, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/decorators/auth-guard.decorator';
import { AlertService } from './alert.service';
import { AlertQueryDto, CreateAlertDto } from 'src/common/types/dto/alert.dto';
import { ApiResponse } from 'src/common/types/dto/response.dto';
import { AlertQueryService } from './query/alert-query.service';
import { IAlert } from '@traceo/types';

@Controller('alert')
@ApiTags('alert')
@UseGuards(new AuthGuard())
export class AlertController {
    constructor(
        private readonly alertService: AlertService,
        private readonly alertQueryService: AlertQueryService,
    ) { }

    @Get()
    public async getAlertsForProject(
        @Query() query: AlertQueryDto
    ): Promise<ApiResponse<IAlert[]>> {
        console.log("query: ", query);
        return this.alertQueryService.getPaginateApiListDto(query);
    }

    @Post()
    public async createAlert(
        @Body() dto: CreateAlertDto
    ): Promise<ApiResponse<unknown>> {
        return await this.alertService.createAlert(dto);
    }
}
