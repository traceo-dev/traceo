import { Injectable, Logger } from "@nestjs/common";
import { AlertStatus, LogicOperator, OperatorEnum } from "@traceo/types";
import dayjs from "dayjs";
import { ClickhouseService } from "src/common/services/clickhouse/clickhouse.service";
import { IncidentRule } from "src/common/types/dto/alert.dto";
import { AlertRule } from "src/db/entities/alert-rule.entity";
import { Alert } from "src/db/entities/alert.entity";
import { Incident } from "src/db/entities/incident.entity";
import { EntityManager } from "typeorm";
import dateUtils from "src/common/helpers/dateUtils";

const allValuesTrue = (arr: boolean[]): boolean => {
    return arr.every((value) => value === true);
}

const anyValueTrue = (arr: boolean[]): boolean => {
    return arr.some((value) => value === true);
}

const mapOperatorToSql: Record<OperatorEnum, string> = {
    equals: "=",
    like: "LIKE",
    starts_with: "STARTSWITH"
}

@Injectable()
export class AlertIncidentService {
    private readonly logger: Logger;

    constructor(
        private readonly entityManager: EntityManager,
        private readonly clickhouseService: ClickhouseService
    ) {
        this.logger = new Logger(AlertIncidentService.name);
    }

    public async run(alerts: Alert[]) {
        if (alerts.length === 0) {
            return;
        }

        try {
            for (const alert of alerts) {
                if (alert.status !== AlertStatus.ACTIVE) {
                    continue;
                }

                if (this.shouldBeTriggered(alert)) {
                    const results: boolean[] = [];

                    if (alert.rules.length === 0) {
                        this.logger.log(`[${this.run.name}] No rules for alert: ${alert.id}`);
                        return;
                    }

                    for (const rule of alert.rules) {
                        switch (rule.type) {
                            case IncidentRule.OCCUR_MORE_THAN:
                                await this.checkIfThereIsMoreIncidentsThan(alert, rule).then((val) => results.push(val));
                                break;
                            case IncidentRule.EVENTS_NUMBER_INTERVAL:
                                await this.checkIfThereIsMoreEventsThan(rule).then((val) => results.push(val));
                                break;
                            case IncidentRule.OCCUR_NEW_INCIDENT:
                                await this.checkIfOccurNewIncident(alert).then((val) => results.push(val));
                                break;
                            case IncidentRule.OCCUR_NEW_INCIDENT_WITH:
                                await this.checkOccurNewIncidentWith(alert, rule).then((val) => results.push(val));
                                break;
                            default:
                                break;

                        }
                    }

                    const operator: LogicOperator = alert.logicOperator;
                    const isOK = operator === LogicOperator.ALL ? allValuesTrue(results) : anyValueTrue(results);

                    console.log(`alert: ${alert.id}, OK: ${isOK}`);

                    if (isOK) {
                        await this.entityManager.getRepository(Alert).update({ id: alert.id }, {
                            lastTriggered: dateUtils.toUnix()
                        });

                        this.createNotification(alert);
                    }
                }
            }
        } catch (err) {
            this.logger.error(`[${this.run.name}] Caused by: ${err}`);
            throw new Error(err);
        }
    }

    private createNotification(alert: Alert) {
        // create new notification for users
    }

    private shouldBeTriggered(alert: Alert) {
        const lastTriggered = alert.lastTriggered;
        if (!lastTriggered) {
            return true;
        }

        const minNotifyInterval = alert.minNotifyInterval;

        const nextNotify = dayjs.unix(lastTriggered).add(minNotifyInterval, "minutes").unix();
        return nextNotify <= dayjs().unix();
    }

    private async checkIfOccurNewIncident(alert: Alert) {
        const projectId = alert.project.id;
        const lastTriggered = alert.lastTriggered;

        const count = await this.entityManager.getRepository(Incident)
            .createQueryBuilder('incident')
            .where('incident.project_id = :projectId', { projectId })
            .andWhere('incident.created_at > :lastTriggered', { lastTriggered })
            .getCount();

        return count > 0;
    }

    private async checkOccurNewIncidentWith(alert: Alert, rule: AlertRule) {
        const projectId = alert.project.id;
        const lastTriggered = alert.lastTriggered;

        const count = await this.entityManager.getRepository(Incident)
            .createQueryBuilder('incident')
            .where('incident.project_id = :projectId', { projectId })
            .andWhere('incident.created_at > :lastTriggered', { lastTriggered })
            .andWhere(`incident.${rule.field} ${mapOperatorToSql[rule.operator]} :value`, { value: rule.value })
            .getCount();

        return count > 0;
    }

    private async checkIfThereIsMoreIncidentsThan(alert: Alert, rule: AlertRule) {
        const projectId = alert.project.id;
        const minCreatedAt = dayjs().subtract(rule.time, "minutes").unix();

        const count = await this.entityManager.getRepository(Incident)
            .createQueryBuilder('incident')
            .where('incident.project_id = :projectId', { projectId })
            .andWhere('incident.created_at > :minCreatedAt', { minCreatedAt })
            .getCount();

        return count > rule.count;
    }

    private async checkIfThereIsMoreEventsThan(rule: AlertRule) {
        const minCreatedAt = dayjs().subtract(rule.time, "minutes").unix();
        const count = await this.clickhouseService.loadEventsCountForIncidentInTimeRange(rule.incidentId, minCreatedAt);
        return count > rule.count;
    }
}

