import { Injectable } from "@nestjs/common";
import { Application } from "../../db/entities/application.entity";
import { Incident } from "../../db/entities/incident.entity";
import dateUtils from "../../helpers/dateUtils";
import { EntityManager, UpdateResult } from "typeorm";
import { BaseWorkerService } from "../../../lib/core/worker/base-worker.service";
import { TraceoIncidentModel } from "../../../lib/types/interfaces/incident.interface";
import { IncidentStatus } from "../../../lib/types/enums/incident.enum";

@Injectable()
export class ProcessIncidentsService extends BaseWorkerService<TraceoIncidentModel> {
    constructor(
        private readonly entityManager: EntityManager,
    ) {
        super(entityManager);
    }

    public async handle(application: Application, data: TraceoIncidentModel): Promise<void> {
        const { type, message } = data;

        await this.entityManager.transaction(async (manager) => {
            let incidentQuery = manager.getRepository(Incident)
                .createQueryBuilder('incident')
                .innerJoin('incident.application', 'application', 'application.id = :id', { id: application.id })
                .where('incident.type = :type', { type })

            if (message) {
                incidentQuery.where('incident.message = :message', { message })
            }

            const incident = await incidentQuery.getOne();

            if (incident) {
                this.saveError(incident, manager);
                this.updateApplication(application, false, manager);

                this.logger.log(`Incident successfully processed. Incident has been grouped to main incident: ${incident.id}`);
                return;
            }

            const promises = [
                await this.createNewIncident(application, data, manager),
                await this.updateApplication(application, true, manager)
            ];

            await Promise.all(promises);
            this.logger.log(`Incident successfully processed for application: ${application.id}.`);
        });
    }

    private async createNewIncident(app: Application, incident: TraceoIncidentModel, manager: EntityManager = this.entityManager): Promise<void> {
        const incidentPayload: Partial<Incident> = {
            status: IncidentStatus.UNRESOLVED,
            createdAt: dateUtils.toUnix(),
            errorsCount: 1,
            lastError: dateUtils.toUnix(),
            errorsDetails: [{ date: dateUtils.toUnix() }],
            application: app,
            ...incident
        }

        await manager.getRepository(Incident)
            .createQueryBuilder()
            .insert()
            .into(Incident)
            .values(incidentPayload)
            .execute();
    }

    private async updateApplication(app: Application, incrementIncidentCount: boolean, manager: EntityManager = this.entityManager): Promise<UpdateResult> {
        const incrementValue = incrementIncidentCount ? 1 : 0;
        const sql = `
          UPDATE application
          SET last_incident_at = ${dateUtils.toUnix()},
              errors_count = errors_count + 1,
              incidents_count = incidents_count + ${incrementValue}
          WHERE id = '${app.id}'
        `;
        return await manager.query(sql);
    }

    private async saveError({ id, errorsCount, errorsDetails }: Incident, manager: EntityManager = this.entityManager) {
        errorsDetails.push({ date: dateUtils.toUnix() });
        await manager.getRepository(Incident).update({ id },
            {
                errorsDetails,
                errorsCount: (errorsCount += 1),
                lastError: dateUtils.toUnix()
            },
        );
    }
}