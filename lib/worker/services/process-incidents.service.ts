import { Injectable, Logger } from "@nestjs/common";
import { Application } from "lib/db/entities/application.entity";
import { Incident } from "lib/db/entities/incident.entity";
import { isEmpty } from "lib/helpers/base";
import dateUtils from "lib/helpers/dateUtils";
import { IncidentStatus } from "lib/types/incident";
import { IncidentExistsPayload, TraceoIncidentModel } from "lib/types/worker";
import { EntityManager } from "typeorm";

@Injectable()
export class ProcessIncidentsService {
    constructor(
        private readonly entityManager: EntityManager
    ) { }

    async processIncident(id: number, incident: TraceoIncidentModel): Promise<void> {
        if (!id) {
            Logger.error(`[${this.processIncident.name}] SDK Incident cannot be processed without appID!`)
            return;
        }

        if (!incident || isEmpty(incident)){
            Logger.error(`[${this.processIncident.name}] SDK Incident cannot be processed without incident body!`)
            return;
        }

        await this.entityManager.transaction(async (manager) => {
            try {
                const incidentExistsPayload: IncidentExistsPayload = { appId: id, incident }
                const incidentExists = await this.handleGroupIncident(incidentExistsPayload, manager);
                if (incidentExists) {
                    return;
                }

                await this.saveIncident(id, incident, manager);

                Logger.log(
                    `[${this.processIncident.name}] Incident successfully processed for application: ${id}.`,
                );
            } catch (error) {
                Logger.error(
                    `[${this.processIncident.name}] Error during processing incident. Caused by: ${error}`,
                );
            }
        });
    }

    private async saveIncident(appId: number, incident: TraceoIncidentModel, manager: EntityManager = this.entityManager): Promise<void> {
        const application = await this.updateApplication(appId, manager);
        const incidentPayload: Partial<Incident> = {
            status: IncidentStatus.UNRESOLVED,
            createdAt: dateUtils.toUnix(),
            occuredCount: 1,
            lastOccur: dateUtils.toUnix(),
            occurDates: [{ date: dateUtils.toUnix() }],
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

    private async handleGroupIncident(
        payload: IncidentExistsPayload,
        manager: EntityManager = this.entityManager,
    ): Promise<boolean> {
        const { appId, incident } = payload;
        const { type, message } = incident;

        const existedIncident = await manager.getRepository(Incident)
            .createQueryBuilder('incident')
            .innerJoin('incident.application', 'application', 'application.id = :id', { id: appId })
            .where('incident.type = :type', { type })
            .andWhere('incident.message = :message', { message })
            .getOne();

        if (existedIncident) {
            await this.saveIncidentOccur(existedIncident, manager);
            await this.updateApplication(appId, manager);

            Logger.log(
                `[processSDKIncident] Incident successfully processed. Incident has been grouped to main incident: ${existedIncident.id}`,
            );

            return true;
        }

        return false;
    }

    private async updateApplication(appId: number, manager: EntityManager = this.entityManager): Promise<Application> {
        return await manager.getRepository(Application).save(
            { id: appId, lastIncidentAt: dateUtils.toUnix() },
        );
    }

    private async saveIncidentOccur(incident: Incident, manager: EntityManager = this.entityManager) {
        incident?.occurDates.push({ date: dateUtils.toUnix() });
        await manager.getRepository(Incident).update(
            { id: incident?.id },
            {
                occuredCount: (incident.occuredCount += 1),
                occurDates: incident?.occurDates,
                lastOccur: dateUtils.toUnix()
            },
        );
    }
}