import { Injectable, Logger } from '@nestjs/common';
import { INTERNAL_SERVER_ERROR } from 'src/common/helpers/constants';
import { CreateAlertDto } from 'src/common/types/dto/alert.dto';
import { ApiResponse } from 'src/common/types/dto/response.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class AlertService {
    private readonly logger: Logger;

    constructor(
        private readonly entityManger: EntityManager
    ) {
        this.logger = new Logger(AlertService.name);
    }

    public async createAlert(dto: CreateAlertDto): Promise<ApiResponse<unknown>> {
        try {
            // TODO: implement
            return new ApiResponse("success", undefined, undefined)
        } catch (error) {
            this.logger.error(`[${this.createAlert.name}] Caused by: ${error}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, error);
        }
    }

    private async createAlertRule() {
        // TODO: implement
    }
}
