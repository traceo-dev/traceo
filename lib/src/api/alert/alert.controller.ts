import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/decorators/auth-guard.decorator';
import { AlertService } from './alert.service';
import { CreateAlertDto } from 'src/common/types/dto/alert.dto';
import { ApiResponse } from 'src/common/types/dto/response.dto';

@Controller('alert')
@ApiTags('alert')
@UseGuards(new AuthGuard())
export class AlertController {
    constructor(
        private readonly alertService: AlertService
    ) { }

    @Post()
    public createAlert(
        @Body() dto: CreateAlertDto
    ): Promise<ApiResponse<unknown>> {
        return this.alertService.createAlert(dto);
    }
}
