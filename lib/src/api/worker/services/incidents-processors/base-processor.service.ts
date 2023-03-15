import { Logger } from "@nestjs/common";
import { BaseIncidentType, ErrorDetails, IIncident, IncidentStatus } from "@traceo/types";
import dateUtils from "../../../../common/helpers/dateUtils";
import { Application } from "../../../../db/entities/application.entity";
import { Incident } from "../../../../db/entities/incident.entity";
import { EntityManager } from "typeorm";
import { IProcessor } from "./processor.interface";

/**
 * Core service for handling incoming incidents.
 * For each type of SDK, a dedicated processor should be created, which will contain the logic for a specific SDK.
 */
export abstract class BaseProcessorService<T extends BaseIncidentType> implements IProcessor<T> {
  public logger: Logger;

  constructor(private readonly entityManager: EntityManager) {
    this.logger = new Logger(BaseProcessorService.name);
  }

  public async process(app: Application, data: T): Promise<void> {
    const appId = app.id;

    await this.entityManager
      .transaction(async (manager) => {
        const { exists, incident } = await this.isDuplicate(
          appId,
          {
            message: data.message,
            type: data.type
          },
          manager
        );

        if (!exists) {
          await this.save(app, data, manager);
          await this.updateApplication(appId, true);

          this.logger.log("Incident processed.");

          return;
        }

        if (exists && !incident) {
          this.logger.error("Cannot process incident. Caused by: incident cannot be null!");
          return;
        }

        await this.saveError(incident, data, manager);
        await this.updateApplication(appId, false);
        this.logger.log("Error grouped to main incident.");
      })
      .catch((error) => {
        this.logger.error(`Cannot process incoming incident. Caused by: ${error}`);
      });
  }

  public async save(
    app: Application,
    incident: T,
    manager: EntityManager = this.entityManager
  ): Promise<void> {
    const incidentPayload: Partial<Incident> = {
      status: IncidentStatus.UNRESOLVED,
      errorsCount: 1,
      createdAt: dateUtils.toUnix(),
      lastError: dateUtils.toUnix(),
      errorsDetails: [this.constructError(incident)],
      application: app,
      ...incident
    };

    await manager
      .getRepository(Incident)
      .createQueryBuilder()
      .insert()
      .into(Incident)
      .values(incidentPayload)
      .execute();
  }

  public abstract constructError(incident: T): ErrorDetails;

  public async isDuplicate(
    id: string,
    { type, message }: { type: string; message: string },
    manager: EntityManager = this.entityManager
  ): Promise<{
    exists: boolean;
    incident?: IIncident;
  }> {
    let query = manager
      .getRepository(Incident)
      .createQueryBuilder("incident")
      .innerJoin("incident.application", "application", "application.id = :id", { id })
      .where("incident.type = :type", { type });

    if (message) {
      query.where("incident.message = :message", { message });
    }

    const incident = await query.getOne();
    return {
      exists: incident !== null,
      incident
    };
  }

  public async updateApplication(
    id: string,
    increment: boolean,
    manager: EntityManager = this.entityManager
  ): Promise<void> {
    const incrementValue = increment ? 1 : 0;
    const sql = `
              UPDATE application
              SET last_incident_at = ${dateUtils.toUnix()},
                  errors_count = errors_count + 1,
                  incidents_count = incidents_count + ${incrementValue}
              WHERE id = '${id}'
            `;
    return await manager.query(sql);
  }

  private async saveError(
    incident: IIncident,
    incomingError: T,
    manager: EntityManager = this.entityManager
  ) {
    let { id, errorsCount, errorsDetails } = incident;

    errorsDetails.push(this.constructError(incomingError));

    await manager.getRepository(Incident).update(
      { id },
      {
        errorsDetails,
        errorsCount: (errorsCount += 1),
        lastError: dateUtils.toUnix()
      }
    );
  }
}
