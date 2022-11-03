import { Injectable, Logger } from "@nestjs/common";
import { Application } from "../../db/entities/application.entity";
import { Incident } from "../../db/entities/incident.entity";
import { isEmpty } from "../../helpers/base";
import dateUtils from "../../helpers/dateUtils";
import { IncidentStatus } from "../../types/incident";
import { TraceoIncidentModel } from "../../types/worker";
import { EntityManager } from "typeorm";
import { ApplicationQueryService } from "../../../lib/application/application-query/application-query.service";
import { ProcessIncidentError } from "../../../lib/helpers/errors";

@Injectable()
export class ProcessIncidentsService {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly appService: ApplicationQueryService
    ) { }

    async processIncident(id: number, incident: TraceoIncidentModel): Promise<void> {
        if (!id) {
            Logger.error(`[${this.processIncident.name}] SDK Incident cannot be processed without appID!`)
            return;
        }

        if (!incident || isEmpty(incident)) {
            Logger.error(`[${this.processIncident.name}] SDK Incident cannot be processed without incident body!`)
            return;
        }

        await this.appService.checkAppExists(id);

        await this.entityManager.transaction(async (manager) => {
            try {
                const { type, message } = incident;

                const inc = await manager.getRepository(Incident)
                    .createQueryBuilder('incident')
                    .innerJoin('incident.application', 'application', 'application.id = :id', { id })
                    .where('incident.type = :type', { type })
                    .andWhere('incident.message = :message', { message })
                    .getOne();

                if (inc) {
                    await this.saveError(inc, manager);

                    Logger.log(
                        `[processSDKIncident] Incident successfully processed. Incident has been grouped to main incident: ${inc.id}`,
                    );

                    return;
                }

                await this.createNewIncident(id, incident, manager);
                await this.updateApplication(id, manager);

                Logger.log(
                    `[${this.processIncident.name}] Incident successfully processed for application: ${id}.`,
                );
            } catch (error) {
                throw new ProcessIncidentError(error);
            }
        });
    }

    private async createNewIncident(appId: number, incident: TraceoIncidentModel, manager: EntityManager = this.entityManager): Promise<void> {
        const application = await this.updateApplication(appId, manager);
        const incidentPayload: Partial<Incident> = {
            status: IncidentStatus.UNRESOLVED,
            createdAt: dateUtils.toUnix(),
            errorsCount: 1,
            lastError: dateUtils.toUnix(),
            errorsDetails: [{ date: dateUtils.toUnix() }],
            application,
            ...incident
        }

        await manager.getRepository(Incident)
            .createQueryBuilder()
            .insert()
            .into(Incident)
            .values(incidentPayload)
            .execute();
    }

    private async updateApplication(appId: number, manager: EntityManager = this.entityManager): Promise<Application> {
        return await manager.getRepository(Application).save(
            { id: appId, lastIncidentAt: dateUtils.toUnix() },
        );
    }

    private async saveError(incident: Incident, manager: EntityManager = this.entityManager) {
        incident?.errorsDetails.push({ date: dateUtils.toUnix() });
        await manager.getRepository(Incident).update(
            { id: incident?.id },
            {
                errorsCount: (incident.errorsCount += 1),
                errorsDetails: incident?.errorsDetails,
                lastError: dateUtils.toUnix()
            },
        );
    }
}