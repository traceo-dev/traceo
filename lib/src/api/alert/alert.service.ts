import { Injectable, Logger } from '@nestjs/common';
import { AlertStatus } from '@traceo/types';
import { INTERNAL_SERVER_ERROR } from '../../common/helpers/constants';
import dateUtils from '../../common/helpers/dateUtils';
import { AlertDto } from '../../common/types/dto/alert.dto';
import { ApiResponse } from '../../common/types/dto/response.dto';
import { AlertRule } from '../../db/entities/alert-rule.entity';
import { Alert } from '../../db/entities/alert.entity';
import { Member } from '../../db/entities/member.entity';
import { EntityManager } from 'typeorm';
import { AlertQueryService } from './alert-query/alert-query.service';

@Injectable()
export class AlertService {
    private readonly logger: Logger;

    constructor(
        private readonly entityManager: EntityManager,
        private readonly alertQueryService: AlertQueryService
    ) {
        this.logger = new Logger(AlertService.name);
    }

    public async createAlert(dto: AlertDto): Promise<ApiResponse<unknown>> {
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

    public async update(alertId: string, update: AlertDto) {
        console.log({ alertId, update })
        return await this.entityManager.transaction(async (manager) => {
            const alert = await this.alertQueryService.getTransactionalDto(alertId, manager);
            const alertRules = await manager.getRepository(AlertRule).find({ where: { alert: { id: alertId } } });

            if (!alert) {
                return;
            }

            // Remove rules from db if was removed earlier
            const updatedRules = update.rules.map((e) => e.id);
            const removedRules = alertRules.filter((e) => !updatedRules.includes(e.id));

            removedRules.forEach(async (rule) => await manager.getRepository(AlertRule).remove(rule));

            // Update rules, creating new rules if was added earlier
            const rules: Partial<AlertRule>[] = update.rules.map((rule) => ({ ...rule, alert }));
            await manager.getRepository(AlertRule).save(rules);

            // Update recipients
            const updatedRecipients = update.recipients;
            const removedRecipients = alert.recipients.filter((e) => !update.recipients.includes(e.id));

            // Remove from db removed alert recipients
            removedRecipients.forEach(async (recipient) => {
                await manager
                    .createQueryBuilder()
                    .delete()
                    .from("alert_recipients_member")
                    .where("alert_id = :alertId AND member_id = :recipientId", { alertId, recipientId: recipient.id })
                    .execute();
            });

            // Add new recipients to alert
            const newRecipients = updatedRecipients.filter((e) => !alert.recipients.map((e) => e.id).includes(e));
            newRecipients.forEach(async (recipient) => {
                await manager
                    .createQueryBuilder()
                    .insert()
                    .into("alert_recipients_member")
                    .values({
                        alert_id: alertId,
                        member_id: recipient
                    })
                    .execute();
            })


            // remove removed recipients

            // Update alert
            await manager.getRepository(Alert).update({ id: alertId }, {
                name: update.name,
                description: update.description,
                severity: update.severity,
                minTimeInterval: update.minTimeInterval,
                type: update.type,
                status: update.status,
                logicOperator: update.logicOperator,
                inAppNotification: update.inAppNotification,
                emailNotification: update.emailNotification
            });
        }).then(() => {
            return new ApiResponse("success", "Alert updated");
        }).catch((err) => {
            this.logger.error(`[${this.delete.name}] Caused by: ${err}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
        });
    }
}
