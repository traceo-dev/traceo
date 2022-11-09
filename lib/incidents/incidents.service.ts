import { Injectable } from "@nestjs/common";
import { Incident } from "../db/entities/incident.entity";
import { EntityManager } from "typeorm";
import { AccountQueryService } from "../../lib/account/account-query/account-query.service";
import { IncidentBatchUpdateDto, IncidentUpdateDto } from "../../lib/types/dto/incident.dto";

@Injectable()
export class IncidentsService {
  constructor(
    private entityManger: EntityManager,
    private accountQueryService: AccountQueryService
  ) { }

  async updateIncident(
    incidentId: string,
    update: IncidentUpdateDto,
  ): Promise<void> {
    if (!update) {
      return;
    }

    await this.entityManger.transaction(async (manager) => {
      if (update.assignedId) {
        const account = await this.accountQueryService.getDto(update.assignedId);
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
      .createQueryBuilder()
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
}
