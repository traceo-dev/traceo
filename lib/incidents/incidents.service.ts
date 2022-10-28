import { Injectable } from "@nestjs/common";
import { Account } from "../db/entities/account.entity";
import { Incident } from "../db/entities/incident.entity";
import { IncidentBatchUpdateDto, IncidentUpdateDto } from "../types/incident";
import { EntityManager } from "typeorm";

@Injectable()
export class IncidentsService {
  constructor(private entityManger: EntityManager) {}

  async updateIncident(
    incidentId: string,
    update: IncidentUpdateDto,
  ): Promise<void> {
    if (!update) {
      return;
    }

    await this.entityManger.transaction(async (manager) => {
      if (update.assignedId) {
        const account = await manager
          .getRepository(Account)
          .findOneBy({ id: update.assignedId });
        await manager
          .getRepository(Incident)
          .update({ id: incidentId }, { assigned: account });
        return;
      }

      await manager.getRepository(Incident).update({ id: incidentId }, update);
    });
  }

  async updateBatchIncidents(update: IncidentBatchUpdateDto): Promise<void> {
    const { incidentsIds, ...rest } = update;

    if (!update) {
      return;
    }

    await this.entityManger
      .getRepository(Incident)
      .createQueryBuilder("incident")
      .whereInIds(incidentsIds)
      .update(rest)
      .execute();
  }

  async removeIncident(id: string): Promise<void> {
    await this.entityManger
      .getRepository(Incident)
      .createQueryBuilder("incident")
      .where("incident.id = :id", { id })
      .delete()
      .execute();
  }

  async removeBatchIncidents(update: IncidentBatchUpdateDto): Promise<void> {
    const { incidentsIds } = update;

    await this.entityManger
      .getRepository(Incident)
      .createQueryBuilder("incident")
      .whereInIds(incidentsIds)
      .delete()
      .execute();
  }
}
