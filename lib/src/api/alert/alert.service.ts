import { Injectable, Logger } from '@nestjs/common';
import { AlertStatus } from '@traceo/types';
import { INTERNAL_SERVER_ERROR } from '../../common/helpers/constants';
import dateUtils from '../../common/helpers/dateUtils';
import { CreateAlertDto } from '../../common/types/dto/alert.dto';
import { ApiResponse } from '../../common/types/dto/response.dto';
import { AlertRule } from '../../db/entities/alert-rule.entity';
import { Alert } from '../../db/entities/alert.entity';
import { Member } from '../../db/entities/member.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class AlertService {
    private readonly logger: Logger;

    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.logger = new Logger(AlertService.name);
    }

    public async createAlert(dto: CreateAlertDto): Promise<ApiResponse<unknown>> {
        try {
            await this.entityManager.transaction(async (manager) => {
                let recipients: Member[] = [];
                if (dto.recipients && dto.recipients.length > 0) {
                    recipients = await manager
                        .getRepository(Member)
                        .createQueryBuilder('member')
                        .where('member.id IN (:...ids)', { ids: dto.recipients })
                        .getMany();
                }

                const alert = await manager.getRepository(Alert).save({
                    ...dto,
                    recipients,
                    createdAt: dateUtils.toUnix(),
                    status: AlertStatus.ACTIVE,
                    project: {
                        id: dto.projectId
                    }
                });

                const rules: Partial<AlertRule>[] = dto.rules.map((rule) => ({ ...rule, alert }));
                await manager.getRepository(AlertRule).save(rules);
            })

            return new ApiResponse("success", "Alert created successfully", undefined)
        } catch (error) {
            this.logger.error(`[${this.createAlert.name}] Caused by: ${error}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, error);
        }
    }

    public async delete(alertId: string): Promise<ApiResponse<unknown>> {
        try {
            await this.entityManager
                .getRepository(Alert)
                .createQueryBuilder("alert")
                .where("alert.id = :alertId", { alertId })
                .delete()
                .execute();

            return new ApiResponse("success", "Alert removed");
        } catch (err) {
            this.logger.error(`[${this.delete.name}] Caused by: ${err}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
        }
    }
}
